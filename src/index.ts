import { createRequire } from 'node:module'
import type { Plugin } from 'vite'
import parser from '@babel/parser'
import t from '@babel/types'

const _require = createRequire(import.meta.url)
const traverse = _require('@babel/traverse').default as (typeof import('@babel/traverse'))['default']
const generator = _require('@babel/generator').default as (typeof import('@babel/generator'))['default']

export interface I18nOptions {
  filter?: (text: string, id: string) => boolean | void
  filterFile?: (id: string) => boolean | void
  /**
   * @default '@/i18n'
   */
  importPath?: (id: string) => string
  /**
   * @default 'default'
   */
  importMember?: (id: string) => string
  /**
   * @default '_i18n_t_'
   */
  i18nFnName?: (id: string) => string
}

export default function i18n(options: I18nOptions = {}): Plugin {
  const extensions = ['.jsx', '.tsx']

  return {
    name: 'vite-auto-i18n',
    async transform(code, id) {
      if (!extensions.some((ext) => id.endsWith(ext))) return
      if (options.filterFile?.(id) === false) return

      const importMember = options.importMember?.(id) ?? 'default'
      const importPath = options.importPath?.(id) ?? '@/i18n'
      const i18nFnName = options.i18nFnName?.(id) ?? '_i18n_t_'
      let i18nify = false

      const ast = parser.parse(code, {
        sourceType: 'module',
        // React plugin always run ahead of schedule(enforce:pre). So there is no need for the jsx plugin here.
        // plugins: ['jsx', 'typescript'],
      })

      traverse(ast, {
        CallExpression(path1) {
          if (
            t.isIdentifier(path1.node.callee) &&
            ['jsxDEV', 'jsx', 'jsxs'].includes(path1.node.callee.name)
          ) {
            path1.traverse({
              ObjectProperty(path2) {
                if (t.isIdentifier(path2.node.key)) {
                  if (path2.node.key.name === 'children') {
                    path2.stop()

                    if (t.isStringLiteral(path2.node.value)) {
                      // CASE: jsx("li", { children: "foo" })

                      const newNode = t.cloneNode(path2.node)
                      newNode.value = t.callExpression(
                        t.identifier(i18nFnName),
                        [t.stringLiteral(path2.node.value.value)],
                      )
                      path2.replaceWith(newNode)
                      i18nify = true

                    } else if (t.isArrayExpression(path2.node.value)) {
                      // CASE: jsxs("li", { children: ["foo"] })

                      path2.node.value.elements = path2.node.value.elements.map((element) => {
                        if (t.isStringLiteral(element)) {
                          return t.callExpression(
                            t.identifier(i18nFnName),
                            [t.stringLiteral(element.value)],
                          )
                        }
                        return element
                      })
                      i18nify = true
                    }
                  }
                }
              },
            })
          }
        },
      })

      if (i18nify) {
        const result = generator(ast)
        const importName = importMember === i18nFnName ? importMember : `${importMember} as ${i18nFnName}`

        // TODO: revert sourcemap
        result.code = `import { ${importName} } from "${importPath}";${result.code}`

        return result
      }
    },
  }
}
