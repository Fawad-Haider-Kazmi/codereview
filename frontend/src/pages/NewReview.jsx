import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { oneDark }    from '@codemirror/theme-one-dark'
import { python }     from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java }       from '@codemirror/lang-java'
import { cpp }        from '@codemirror/lang-cpp'
import { reviewService }  from '../services/reviewService'
import { getErrorMessage } from '../utils/helpers'
import { LANGUAGES }       from '../utils/constants'
import { Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const langExtension = {
  python:     python(),
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  java:       java(),
  cpp:        cpp(),
}

const label = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }
const input = { width: '100%', padding: '10px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }

export default function NewReview() {
  const [form, setForm]       = useState({ title: '', language: 'python', code_snippet: '' })
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.code_snippet.trim().length < 10) { toast.error('Please enter at least 10 characters of code.'); return }
    setLoading(true)
    const tid = toast.loading('Analyzing your code with AI…')
    try {
      const { data } = await reviewService.create(form)
      toast.success('Review complete!', { id: tid })
      navigate(`/review/${data.id}`)
    } catch (err) {
      toast.error(getErrorMessage(err), { id: tid })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>New Code Review</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Paste your code and let AI detect bugs, security issues, and improvements.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={label}>Review title</label>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="e.g. User authentication module" required minLength={3} style={input}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border)'} />
        </div>

        <div>
          <label style={label}>Language</label>
          <select value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))} style={{ ...input, cursor: 'pointer' }}>
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        <div>
          <label style={label}>Code</label>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <CodeMirror
              value={form.code_snippet}
              height="400px"
              theme={oneDark}
              extensions={[langExtension[form.language] ?? javascript()]}
              onChange={v => setForm(p => ({ ...p, code_snippet: v }))}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            {form.code_snippet.length} chars · {form.code_snippet.split('\n').length} lines
          </div>
        </div>

        <button type="submit" disabled={loading} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: 13, background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 15,
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          boxShadow: '0 0 24px var(--accent-glow)',
        }}>
          <Zap size={18} /> {loading ? 'Analyzing…' : 'Analyze Code'}
        </button>
      </form>
    </div>
  )
}