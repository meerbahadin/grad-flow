import { extractCodeFromFilePath } from '@/lib/code'
import CodePreview from './code-preview'
import CodeRenderer from './code-renderer'

type CodeBlockProps = {
  filePath?: string
  code?: string
  lang?: string
}

export default function CodeBlock({
  filePath,
  code = '',
  lang = 'tsx',
}: CodeBlockProps) {
  const fileContent = filePath ? extractCodeFromFilePath(filePath) : code

  return (
    <CodePreview code={fileContent}>
      <CodeRenderer code={fileContent} lang={lang} />
    </CodePreview>
  )
}
