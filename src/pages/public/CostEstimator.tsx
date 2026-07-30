import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubmissions } from '../../hooks/useSubmissions';
import { PageMeta } from '../../components/ui/PageMeta';
import { RevealOnScroll } from '../../components/ui/RevealOnScroll';
import ps from '../../styles/pages.module.css';
import est from './CostEstimator.module.css';

type ProjectType = 'custom' | 'renovation' | 'unsure' | null;

type CustomAnswers = {
  city: string;
  sqft: string;
  style: string;
  site: string;
  stories: string;
  features: string[];
};

type RenovationAnswers = {
  city: string;
  sqft: string;
  scope: string;
  style: string;
  structural: string;
  features: string[];
};

const CUSTOM_FEATURES = ['Pool', 'ADU', 'Elevator', 'Home theater', 'Wine cellar', 'None'];
const RENO_FEATURES = ['Kitchen expansion', 'Primary suite', 'Outdoor living', 'ADU', 'None'];

function estimateCustom(a: CustomAnswers) {
  const sqft = Number(a.sqft) || 3500;
  let base = sqft * 425;
  if (a.style === 'traditional-formal') base *= 1.12;
  if (a.style === 'modern-minimalist') base *= 1.08;
  if (a.site === 'sloped') base *= 1.15;
  if (a.site === 'teardown') base *= 1.2;
  if (a.stories === '3+') base *= 1.06;
  base += a.features.filter((f) => f !== 'None').length * 85000;
  const low = Math.round(base * 0.88 / 10000) * 10000;
  const high = Math.round(base * 1.14 / 10000) * 10000;
  return { low, high };
}

function estimateRenovation(a: RenovationAnswers) {
  const sqft = Number(a.sqft) || 2000;
  let perSf = 275;
  if (a.scope === 'whole-house') perSf = 340;
  if (a.scope === 'structural-addition') perSf = 380;
  if (a.scope === 'kitchen-bath') perSf = 220;
  if (a.structural === 'yes') perSf *= 1.18;
  let base = sqft * perSf;
  base += a.features.filter((f) => f !== 'None').length * 45000;
  const low = Math.round(base * 0.85 / 5000) * 5000;
  const high = Math.round(base * 1.12 / 5000) * 5000;
  return { low, high };
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function CostEstimator() {
  const { createSubmission } = useSubmissions();
  const [projectType, setProjectType] = useState<ProjectType>(null);
  const [step, setStep] = useState(0);
  const [custom, setCustom] = useState<CustomAnswers>({ city: '', sqft: '', style: '', site: '', stories: '', features: [] });
  const [reno, setReno] = useState<RenovationAnswers>({ city: '', sqft: '', scope: '', style: '', structural: '', features: [] });
  const [gateDone, setGateDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const range = useMemo(() => {
    if (projectType === 'custom') return estimateCustom(custom);
    if (projectType === 'renovation') return estimateRenovation(reno);
    return null;
  }, [projectType, custom, reno]);

  const totalSteps = 6;

  const reset = () => {
    setProjectType(null);
    setStep(0);
    setGateDone(false);
    setCustom({ city: '', sqft: '', style: '', site: '', stories: '', features: [] });
    setReno({ city: '', sqft: '', scope: '', style: '', structural: '', features: [] });
  };

  const handleGate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createSubmission({
        name: String(fd.get('name')),
        email: String(fd.get('email')),
        phone: String(fd.get('phone')),
        subject: `Cost estimate — ${projectType === 'custom' ? 'Custom home' : 'Renovation'}`,
        message: JSON.stringify({ projectType, custom, reno, range }, null, 2),
        source: 'Cost estimator',
      });
      setGateDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <PageMeta title="How Much Will My Project Cost?" description="Personalized construction cost range for custom homes and major renovations on the Seattle Eastside." />
      <section className={ps.hero}>
        <div className={ps.heroInner}>
          <span className={ps.eyebrow}>Cost & Planning</span>
          <h1 className={ps.heroTitle}>How much will my<br /><em>project cost?</em></h1>
          <p className={ps.bodyText} style={{ marginTop: 24, maxWidth: 560 }}>
            A preliminary range based on your project type and scope — followed by a personal conversation for project-specific pricing.
          </p>
        </div>
      </section>

      <section className={ps.section}>
        <div className={`${ps.sectionInner} ${est.wrap}`}>
          {!projectType && (
            <RevealOnScroll>
              <h2 className={est.stepTitle}>What type of project?</h2>
              <div className={est.branchGrid}>
                <button type="button" className={est.branchCard} onClick={() => { setProjectType('custom'); setStep(0); }}>
                  <strong>New custom home</strong>
                  <span>Ground-up on your lot</span>
                </button>
                <button type="button" className={est.branchCard} onClick={() => { setProjectType('renovation'); setStep(0); }}>
                  <strong>Major renovation</strong>
                  <span>Whole-home or large scope</span>
                </button>
                <button type="button" className={est.branchCard} onClick={() => setProjectType('unsure')}>
                  <strong>Not sure yet</strong>
                  <span>Let&apos;s talk instead</span>
                </button>
              </div>
            </RevealOnScroll>
          )}

          {projectType === 'unsure' && (
            <RevealOnScroll>
              <p className={ps.bodyText}>Neither question set fits yet — tell us about your situation and we will guide you.</p>
              <Link to="/contact?service=Not sure where to start#inquiry" className={ps.btnPrimary} style={{ display: 'inline-block', marginTop: 24 }}>Start a Conversation</Link>
              <button type="button" className={est.backBtn} onClick={reset}>← Back</button>
            </RevealOnScroll>
          )}

          {projectType && projectType !== 'unsure' && step < totalSteps && (
            <RevealOnScroll>
              <div className={est.progress}>
                <span>Question {step + 1} of {totalSteps}</span>
                <div className={est.progressBar}><div style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>
              </div>

              {projectType === 'custom' && step === 0 && (
                <Question label="City / area" value={custom.city} onChange={(v) => setCustom({ ...custom, city: v })} placeholder="e.g. Bellevue" />
              )}
              {projectType === 'custom' && step === 1 && (
                <Question label="Desired finished square footage" value={custom.sqft} onChange={(v) => setCustom({ ...custom, sqft: v })} placeholder="e.g. 4500" type="number" />
              )}
              {projectType === 'custom' && step === 2 && (
                <SelectQuestion label="Architectural style / finish level" value={custom.style} onChange={(v) => setCustom({ ...custom, style: v })} options={[
                  { value: 'modern-minimalist', label: 'Modern minimalist' },
                  { value: 'transitional', label: 'Transitional' },
                  { value: 'traditional-formal', label: 'Traditional / formal' },
                ]} />
              )}
              {projectType === 'custom' && step === 3 && (
                <SelectQuestion label="Site conditions" value={custom.site} onChange={(v) => setCustom({ ...custom, site: v })} options={[
                  { value: 'flat', label: 'Flat, utility-ready lot' },
                  { value: 'sloped', label: 'Sloped or challenging site' },
                  { value: 'teardown', label: 'Teardown required' },
                ]} />
              )}
              {projectType === 'custom' && step === 4 && (
                <SelectQuestion label="Number of stories" value={custom.stories} onChange={(v) => setCustom({ ...custom, stories: v })} options={[
                  { value: '1', label: 'Single story' },
                  { value: '2', label: 'Two stories' },
                  { value: '3+', label: 'Three or more' },
                ]} />
              )}
              {projectType === 'custom' && step === 5 && (
                <MultiSelect label="Special features" options={CUSTOM_FEATURES} selected={custom.features} onChange={(features) => setCustom({ ...custom, features })} />
              )}

              {projectType === 'renovation' && step === 0 && (
                <Question label="City / area" value={reno.city} onChange={(v) => setReno({ ...reno, city: v })} placeholder="e.g. Medina" />
              )}
              {projectType === 'renovation' && step === 1 && (
                <Question label="Square footage affected" value={reno.sqft} onChange={(v) => setReno({ ...reno, sqft: v })} placeholder="Renovated space + addition" type="number" />
              )}
              {projectType === 'renovation' && step === 2 && (
                <SelectQuestion label="Scope of work" value={reno.scope} onChange={(v) => setReno({ ...reno, scope: v })} options={[
                  { value: 'cosmetic', label: 'Cosmetic / finishes only' },
                  { value: 'kitchen-bath', label: 'Kitchen & bath' },
                  { value: 'whole-house', label: 'Whole-house' },
                  { value: 'structural-addition', label: 'Structural addition' },
                ]} />
              )}
              {projectType === 'renovation' && step === 3 && (
                <SelectQuestion label="Style / finish level" value={reno.style} onChange={(v) => setReno({ ...reno, style: v })} options={[
                  { value: 'standard', label: 'Standard' },
                  { value: 'premium', label: 'Premium' },
                  { value: 'estate', label: 'Estate-level' },
                ]} />
              )}
              {projectType === 'renovation' && step === 4 && (
                <SelectQuestion label="Structural changes needed?" value={reno.structural} onChange={(v) => setReno({ ...reno, structural: v })} options={[
                  { value: 'no', label: 'No' },
                  { value: 'yes', label: 'Yes — walls, foundation, or adding a story' },
                ]} />
              )}
              {projectType === 'renovation' && step === 5 && (
                <MultiSelect label="Special features" options={RENO_FEATURES} selected={reno.features} onChange={(features) => setReno({ ...reno, features })} />
              )}

              <div className={est.navBtns}>
                <button type="button" className={est.backBtn} onClick={() => (step === 0 ? reset() : setStep(step - 1))}>← Back</button>
                <button type="button" className={ps.btnPrimary} onClick={() => setStep(step + 1)}>Continue →</button>
              </div>
            </RevealOnScroll>
          )}

          {projectType && projectType !== 'unsure' && step >= totalSteps && !gateDone && range && (
            <RevealOnScroll>
              <h2 className={est.stepTitle}>Your preliminary range</h2>
              <p className={est.rangeBanner}>{fmt(range.low)} – {fmt(range.high)}</p>
              <p className={ps.bodyText} style={{ marginTop: 16 }}>
                Enter your details to save this estimate. A team member will follow up to refine project-specific pricing.
              </p>
              <p className={ps.bodyText} style={{ marginTop: 12, fontSize: 14, maxWidth: 560 }}>
                Financing: John Buchan Homes is not a lender. We refer clients to independent mortgage broker partners. JBH may receive a referral fee from some partners — this does not increase your loan cost. We disclose any referral relationship before you engage a referred partner.
              </p>
              <form onSubmit={handleGate} className={est.gateForm}>
                <input name="name" required placeholder="Full name" className={est.input} />
                <input name="email" type="email" required placeholder="Email" className={est.input} />
                <input name="phone" type="tel" required placeholder="Phone" className={est.input} />
                <button type="submit" className={ps.btnPrimary} disabled={submitting}>{submitting ? 'Sending…' : 'Get My Estimate'}</button>
              </form>
              <button type="button" className={est.backBtn} onClick={() => setStep(totalSteps - 1)}>← Revise answers</button>
            </RevealOnScroll>
          )}

          {gateDone && range && (
            <RevealOnScroll>
              <h2 className={est.stepTitle}>Thank you</h2>
              <p className={est.rangeBanner}>{fmt(range.low)} – {fmt(range.high)}</p>
              <p className={ps.bodyText} style={{ marginTop: 16 }}>Your estimate has been saved. We will be in touch within one business day.</p>
              <div className={ps.ctaButtons} style={{ marginTop: 32 }}>
                <Link to="/contact" className={ps.btnPrimary}>Start a Conversation</Link>
                <Link to="/preconstruction" className={ps.btnLink}>Learn about Preconstruction →</Link>
              </div>
            </RevealOnScroll>
          )}
        </div>
      </section>
    </main>
  );
}

function Question({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className={est.question}>
      <label className={est.label}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={est.input} />
    </div>
  );
}

function SelectQuestion({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className={est.question}>
      <label className={est.label}>{label}</label>
      <div className={est.optionGrid}>
        {options.map((o) => (
          <button key={o.value} type="button" className={`${est.option} ${value === o.value ? est.optionActive : ''}`} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (opt === 'None') return onChange(['None']);
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected.filter((s) => s !== 'None'), opt];
    onChange(next.length ? next : []);
  };
  return (
    <div className={est.question}>
      <label className={est.label}>{label}</label>
      <div className={est.optionGrid}>
        {options.map((o) => (
          <button key={o} type="button" className={`${est.option} ${selected.includes(o) ? est.optionActive : ''}`} onClick={() => toggle(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}
