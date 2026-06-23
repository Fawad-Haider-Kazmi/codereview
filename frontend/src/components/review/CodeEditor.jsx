import CodeMirror from '@uiw/react-codemirror'
import { oneDark }    from '@codemirror/theme-one-dark'
import { python }     from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java }       from '@codemirror/lang-java'
import { cpp }        from '@codemirror/lang-cpp'

const langExtension = {
  python:     python(),
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  java:       java(),
  cpp:        cpp(),
}

export default function CodeEditor({ value, onChange, language = 'python', height = '400px' }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={[langExtension[language] ?? javascript()]}
        onChange={onChange}
        placeholder="// Paste your code here..."
      />
    </div>
  )
}