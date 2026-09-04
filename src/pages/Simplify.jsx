import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import LoadingOverlay from '../components/LoadingOverlay.jsx'
import { Badge, ConfidenceMeter, SectionTitle, SeverityTag, SourceChip } from '../components/ui.jsx'
import { policies, getPolicy, buildUploadedPolicy, policyFromHistory } from '../data/policies.js'
import { skills } from '../data/agents.js'
import SkillCard from '../components/SkillCard.jsx'
import { readHistory, addHistoryEntry, clearHistory, formatWhen } from '../data/history.js'

export default function Simplify() {
  const loc = useLocation()
  const [selected, setSelected] = useState(loc.state?.policyId || null)
  const [upload, setUpload] = useState(null) // an uploaded PDF, as an alternative to `selected`
  const [tab, setTab] = useState('catalogue') // catalogue | upload | history
  const [phase, setPhase] = useState('select') // select | running | result
  const [reopened, setReopened] = useState(null) // a past analysis opened from History
  const [history, setHistory] = useState(() => readHistory())

  // The document analysed is always whichever one the active tab holds, so
  // switching tabs swaps the target without discarding the other choice.
  const active = tab === 'upload' ? (upload ? buildUploadedPolicy(upload) : null) : getPolicy(selected)
  const policy = reopened || active

  // Scroll back to the top when the agent starts running / shows results.
  useEffect(() => {
    if (phase !== 'select') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase])

  const start = () => setPhase('running')

  // Only a fresh run is logged — reopening a past analysis must not re-log it.
  const finish = () => {
    setHistory(addHistoryEntry(active))
    setPhase('result')
  }

  const reopen = (entry) => {
    setReopened(policyFromHistory(entry))
    setPhase('result')
  }

  const reset = () => {
    setPhase('select')
    setSelected(null)
    setUpload(null)
    setReopened(null)
    setTab('catalogue')
  }

  const header = (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <Badge tone="red" icon="simplify">Simplify Agent · Policy Explainer</Badge>
        <h1 className="mt-2 text-2xl font-extrabold text-pru-ink">Plain-English policy breakdown</h1>
        <p className="text-pru-slate mt-1 max-w-2xl">
          Pick a Prudential policy or upload your own PDF, start the analysis, and the agent reads the document and
          returns an honest summary — coverage, exclusions and jargon explained.
        </p>
      </div>
      {phase !== 'select' && (
        <button onClick={reset} className="btn-ghost">
          <Icon name="arrow" className="w-4 h-4 rotate-180" /> New analysis
        </button>
      )}
    </div>
  )

  if (phase === 'result') {
    return (
      <div className="space-y-6">
        {header}
        <FlowSteps phase={phase} source={policy?.uploaded ? 'upload' : 'catalogue'} />
        <Result policy={policy} />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5 items-start">
      <div className="lg:col-span-2 space-y-6">
        {header}
        <FlowSteps phase={phase} source={tab === 'upload' ? 'upload' : 'catalogue'} />

        <div>
          <SectionTitle
            kicker="Step 1"
            title="Choose a document"
            icon="doc"
            right={
              tab !== 'history' && (
                <button disabled={!active} onClick={start} className="btn-primary">
                  {tab === 'upload' ? (
                    <>
                      <Icon name="bolt" className="w-4 h-4" /> Analyse document
                    </>
                  ) : (
                    <>
                      <Icon name="doc" className="w-4 h-4" /> View breakdown
                    </>
                  )}
                </button>
              )
            }
          />
          <SourceTabs
            tab={tab}
            onChange={setTab}
            catalogueCount={policies.length}
            uploadName={upload?.name}
            historyCount={history.length}
          />

          {tab === 'catalogue' && (
            <div className="animate-fade-up">
              <p className="mb-3 flex items-center gap-1.5 text-xs text-pru-slate">
                <Icon name="lock" className="w-3.5 h-3.5 text-good shrink-0" />
                Prudential’s own policies ship with an approved plain-English breakdown — no AI generation needed.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {policies.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    className={`card p-4 text-left transition-all hover:-translate-y-0.5 ${
                      selected === p.id ? 'ring-2 ring-pru-red border-pru-red' : 'hover:shadow-pop'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge tone="slate">{p.category}</Badge>
                      {selected === p.id && <Icon name="check" className="w-5 h-5 text-pru-red" strokeWidth={3} />}
                    </div>
                    <h3 className="mt-2 font-extrabold text-pru-ink">{p.name}</h3>
                    <p className="text-xs text-pru-slate mt-0.5">{p.tagline}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-pru-slate font-mono">
                      <span>{p.docRef}</span>
                      <span>{p.pages} pp · {p.premiumFrom}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'upload' && (
            <UploadPanel file={upload} onFile={setUpload} onClear={() => setUpload(null)} />
          )}

          {tab === 'history' && (
            <HistoryPanel
              entries={history}
              onOpen={reopen}
              onClear={() => setHistory(clearHistory())}
            />
          )}
        </div>
      </div>

      <SkillCard skill={skills.simplify} accentTitle="simplify.SKILLS.md" live={phase === 'running'} />

      {phase === 'running' && (
        <LoadingOverlay
          label={tab === 'upload' ? 'Simplify Agent' : 'Prudential policy library'}
          sublabel={
            tab === 'upload'
              ? `Analysing “${policy.name}”…`
              : `Retrieving verified breakdown — ${policy.name}…`
          }
          onDone={finish}
        />
      )}
    </div>
  )
}

// Segmented control: a verified catalogue policy, the consultant's own PDF, or
// a past analysis.
function SourceTabs({ tab, onChange, catalogueCount, uploadName, historyCount }) {
  const tabs = [
    { key: 'catalogue', icon: 'doc', label: 'Prudential policies', hint: `${catalogueCount} verified` },
    { key: 'upload', icon: 'upload', label: 'Upload & analyse', hint: uploadName || 'Any insurer’s PDF' },
    { key: 'history', icon: 'history', label: 'History', hint: `${historyCount} recent` },
  ]
  return (
    <div className="mb-4 flex flex-wrap gap-1.5 rounded-2xl border border-pru-line bg-white p-1.5 shadow-card">
      {tabs.map((t) => {
        const active = tab === t.key
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            aria-pressed={active}
            className={`flex-1 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left transition-all ${
              active
                ? 'bg-pru-red text-white shadow-sm'
                : 'text-pru-slate hover:text-pru-ink hover:bg-pru-mist'
            }`}
          >
            <Icon
              name={t.icon}
              className={`w-4 h-4 shrink-0 ${active ? 'text-white' : ''}`}
              strokeWidth={2.2}
            />
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight whitespace-nowrap">{t.label}</span>
              <span className={`block text-[11px] truncate ${active ? 'text-white/75' : 'text-pru-slate'}`}>
                {t.hint}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

// Past Simplify runs, newest first. Clicking one re-opens that breakdown
// straight away — no re-run.
function HistoryPanel({ entries, onOpen, onClear }) {
  if (!entries.length) {
    return (
      <div className="card p-8 flex flex-col items-center text-center animate-fade-up">
        <div className="w-12 h-12 rounded-xl bg-pru-mist text-pru-slate flex items-center justify-center">
          <Icon name="history" className="w-6 h-6" />
        </div>
        <div className="mt-3 font-extrabold text-pru-ink">No analyses yet</div>
        <p className="mt-1 text-xs text-pru-slate max-w-xs">
          Analysed documents appear here so you can re-open a breakdown without running it again.
        </p>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-pru-slate">Re-open a breakdown instantly — nothing is re-run.</p>
        <button onClick={onClear} className="text-xs font-bold text-pru-slate hover:text-bad transition-colors">
          Clear history
        </button>
      </div>
      <div className="space-y-2.5">
        {entries.map((e) => {
          const uploaded = e.source === 'upload'
          return (
            <button
              key={e.key}
              onClick={() => onOpen(e)}
              className="card w-full p-4 text-left flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-pop"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  uploaded ? 'bg-info-soft text-info' : 'bg-bad-soft text-pru-red'
                }`}
              >
                <Icon name={uploaded ? 'upload' : 'doc'} className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-pru-ink truncate">{e.name}</div>
                <div className="text-[11px] text-pru-slate font-mono truncate">{e.docRef}</div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                <Badge tone={uploaded ? 'info' : 'slate'}>{uploaded ? 'Uploaded' : 'Prudential'}</Badge>
                <span className="text-[11px] text-pru-slate">{formatWhen(e.at)}</span>
              </div>
              <Icon name="arrow" className="w-4 h-4 text-pru-slate shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

const prettySize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

const MAX_MB = 10

// Alternative to picking from the catalogue: the consultant drops in their own
// policy PDF. Drag-and-drop or the normal file picker, with a short simulated
// transfer so the upload reads as something that actually happened.
function UploadPanel({ file, onFile, onClear }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(null) // file mid-"transfer"
  const [progress, setProgress] = useState(0)

  // Drive the transfer bar, then hand the file up once it completes.
  useEffect(() => {
    if (!pending) return
    if (progress >= 100) {
      const t = setTimeout(() => {
        onFile(pending)
        setPending(null)
        setProgress(0)
      }, 220)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + 14)), 70)
    return () => clearTimeout(t)
  }, [pending, progress, onFile])

  const accept = (f) => {
    if (!f) return
    if (!(f.type === 'application/pdf' || /\.pdf$/i.test(f.name))) {
      setError(`“${f.name}” isn’t a PDF. Upload a policy document in PDF format.`)
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`“${f.name}” is ${prettySize(f.size)} — the limit is ${MAX_MB} MB.`)
      return
    }
    setError(null)
    setProgress(0)
    setPending(f)
  }

  // Uploading — transfer bar
  if (pending) {
    return (
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-bad-soft text-pru-red flex items-center justify-center shrink-0">
            <Icon name="upload" className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-pru-ink truncate">{pending.name}</div>
            <div className="text-xs text-pru-slate">
              {progress >= 100 ? 'Upload complete' : `Uploading… ${progress}%`} · {prettySize(pending.size)}
            </div>
          </div>
          {progress >= 100 && <Icon name="check" className="w-5 h-5 text-good shrink-0" strokeWidth={3} />}
        </div>
        <div className="mt-4 h-2 rounded-full bg-pru-line overflow-hidden">
          <div
            className="h-full rounded-full bg-pru-red transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  // Uploaded — ready to analyse
  if (file) {
    return (
      <div className="animate-fade-up">
        <div className="card p-5 ring-2 ring-pru-red border-pru-red">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-bad-soft text-pru-red flex items-center justify-center shrink-0">
              <Icon name="doc" className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-pru-ink truncate">{file.name}</div>
              <div className="text-xs text-pru-slate mt-0.5">PDF · {prettySize(file.size)} · uploaded just now</div>
            </div>
            <Badge tone="good" icon="check">Ready</Badge>
            <button
              onClick={onClear}
              aria-label="Remove uploaded file"
              className="w-8 h-8 rounded-lg text-pru-slate hover:bg-pru-mist hover:text-pru-ink flex items-center justify-center shrink-0 transition-colors"
            >
              <Icon name="x" className="w-4 h-4" strokeWidth={2.4} />
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-pru-line flex items-center gap-2 text-xs text-pru-slate">
            <Icon name="bolt" className="w-3.5 h-3.5 text-pru-red shrink-0" />
            Hit <span className="font-bold text-pru-ink">Analyse document</span> — the agent reads it and returns
            covered, not covered, and every exclusion flagged.
          </div>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-3 text-xs font-bold text-pru-red hover:underline underline-offset-2"
        >
          Choose a different file
        </button>
        <FileInput inputRef={inputRef} onPick={accept} />
        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-bad">
            <Icon name="alert" className="w-3.5 h-3.5 shrink-0" /> {error}
          </p>
        )}
      </div>
    )
  }

  // Empty — dropzone
  return (
    <div className="animate-fade-up">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          accept(e.dataTransfer.files?.[0])
        }}
        className={`w-full rounded-2xl border-2 border-dashed px-6 py-12 flex flex-col items-center text-center transition-all ${
          dragging
            ? 'border-pru-red bg-bad-soft scale-[1.01]'
            : 'border-pru-line bg-white hover:border-pru-red hover:bg-bad-soft/30'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
            dragging ? 'bg-pru-red text-white scale-110' : 'bg-pru-mist text-pru-slate'
          }`}
        >
          <Icon name="upload" className="w-7 h-7" strokeWidth={2} />
        </div>
        <div className="mt-4 text-lg font-extrabold text-pru-ink">
          {dragging ? 'Drop to upload' : 'Drag & drop a policy PDF'}
        </div>
        <div className="mt-1 text-sm text-pru-slate">
          or <span className="text-pru-red font-bold underline underline-offset-2">browse your files</span>
        </div>
        <p className="mt-4 text-xs text-pru-slate max-w-sm leading-relaxed">
          Any insurer’s policy document — not just Prudential. The Simplify Agent reads it and returns the same
          plain-English breakdown, with every exclusion flagged.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="chip bg-pru-mist text-pru-slate border border-pru-line">PDF only</span>
          <span className="chip bg-pru-mist text-pru-slate border border-pru-line">Up to {MAX_MB} MB</span>
          <span className="chip bg-good-soft text-good">Not stored after the session</span>
        </div>
      </button>

      <FileInput inputRef={inputRef} onPick={accept} />

      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-bad">
          <Icon name="alert" className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}

function FileInput({ inputRef, onPick }) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept="application/pdf,.pdf"
      className="hidden"
      onChange={(e) => {
        onPick(e.target.files?.[0])
        e.target.value = '' // allow re-picking the same file
      }}
    />
  )
}

function FlowSteps({ phase, source = 'catalogue' }) {
  const steps =
    source === 'upload'
      ? ['Upload document', 'Agent analysis', 'Simplified summary']
      : ['Select policy', 'Retrieve breakdown', 'Simplified summary']
  const idx = phase === 'select' ? 0 : phase === 'running' ? 1 : 2
  return (
    <div className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold ${
              i <= idx ? 'bg-pru-red text-white' : 'bg-white text-pru-slate border border-pru-line'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i <= idx ? 'bg-white/25' : 'bg-pru-mist'}`}>
              {i < idx ? <Icon name="check" className="w-3 h-3" strokeWidth={3} /> : i + 1}
            </span>
            {s}
          </span>
          {i < steps.length - 1 && <Icon name="arrow" className="w-4 h-4 text-pru-line" />}
        </div>
      ))}
    </div>
  )
}

function Result({ policy }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <div className="card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="good" icon="check">Summary ready</Badge>
            {policy.uploaded ? (
              <Badge tone="info" icon="upload">Uploaded · AI-analysed</Badge>
            ) : (
              <Badge tone="good" icon="lock">Prudential verified</Badge>
            )}
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-pru-ink">{policy.name}</h2>
          <p className="text-sm text-pru-slate">{policy.tagline}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <SourceChip>{policy.docRef}</SourceChip>
            <SourceChip>
              {policy.pages ? `${policy.pages} pages · updated ${policy.lastUpdated}` : policy.metaLabel}
            </SourceChip>
          </div>
        </div>
        <ConfidenceMeter score={policy.confidence} size={76} />
      </div>

      {policy.uploaded && (
        <div className={`card p-4 flex items-start gap-3 border-l-4 ${policy.recognisedAs ? 'border-l-info' : 'border-l-warn'}`}>
          <Icon
            name={policy.recognisedAs ? 'check' : 'alert'}
            className={`w-5 h-5 shrink-0 mt-0.5 ${policy.recognisedAs ? 'text-info' : 'text-warn'}`}
            strokeWidth={2.4}
          />
          <div>
            <div className="font-bold text-pru-ink text-sm">
              {policy.recognisedAs
                ? `Matched to a known product — ${policy.recognisedAs}`
                : 'Unrecognised document — read against standard policy structure'}
            </div>
            <p className="text-xs text-pru-slate mt-0.5">
              {policy.recognisedAs
                ? 'The agent recognised this document and applied the full product breakdown from the Prudential catalogue.'
                : 'This document isn’t in the Prudential catalogue, so confidence is lower. Verify the breakdown against the source document before advising the client.'}
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Panel title="What's covered" icon="check" tone="good" items={policy.covered} />
        <Panel title="What's not covered" icon="x" tone="warn" items={policy.notCovered} />
      </div>

      {/* Exclusions */}
      <div className="card p-5">
        <SectionTitle kicker="Flagged honestly" title="Exclusions — read these" icon="alert" />
        <div className="grid sm:grid-cols-2 gap-3">
          {policy.exclusions.map((e, i) => (
            <div key={i} className="rounded-xl border border-pru-line p-3.5 flex gap-3">
              <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                e.severity === 'high' ? 'bg-bad-soft text-bad' : e.severity === 'medium' ? 'bg-warn-soft text-warn' : 'bg-pru-mist text-pru-slate'
              }`}>
                <Icon name="alert" className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-pru-ink text-sm">{e.item}</span>
                  <SeverityTag severity={e.severity} />
                </div>
                <p className="text-xs text-pru-slate mt-0.5">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key terms + raw */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <SectionTitle kicker="Jargon, explained" title="Key terms" icon="doc" />
          <dl className="space-y-3">
            {policy.keyTerms.map((t, i) => (
              <div key={i} className="flex gap-3">
                <dt className="w-32 shrink-0 font-bold text-pru-ink text-sm">{t.term}</dt>
                <dd className="text-sm text-pru-slate">{t.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="card p-5">
          <SectionTitle kicker="Source clause" title="Original policy language" icon="lock" />
          <div className="rounded-xl bg-pru-mist border border-pru-line p-4 text-[13px] text-pru-slate leading-relaxed font-mono max-h-56 overflow-y-auto">
            “{policy.raw}”
          </div>
          <p className="mt-2 text-[11px] text-pru-slate">The agent simplified this clause above — original kept for transparency.</p>
        </div>
      </div>
    </div>
  )
}

function Panel({ title, icon, tone, items }) {
  const head = { good: 'text-good', warn: 'text-warn' }[tone]
  return (
    <div className="card p-5">
      <h3 className={`flex items-center gap-2 font-extrabold ${head} mb-3`}>
        <Icon name={icon} className="w-5 h-5" strokeWidth={2.4} /> {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5">
            <Icon name={icon} className={`w-4 h-4 mt-0.5 shrink-0 ${head}`} strokeWidth={2.6} />
            <div>
              <div className="text-sm font-semibold text-pru-ink">{it.item}</div>
              <div className="text-xs text-pru-slate">{it.detail}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
