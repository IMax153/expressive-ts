import * as assert from 'assert'
import * as glob from 'glob'
import * as path from 'path'

const getModuleNames = (): ReadonlyArray<string> => glob.sync('./src/**/*.ts').map((file) => path.parse(file).name)

describe('index', () => {
  it('check exported modules', () => {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires, global-require */
    const exp = require('../src')

    const moduleNames = getModuleNames()

    moduleNames.forEach((name) => {
      if (name !== 'index') {
        const exportName = name.substring(0, 1).toLowerCase() + name.substring(1)

        assert.deepStrictEqual(
          exp[exportName] !== undefined,
          true,
          `The "${name}" module is not exported in src/index.ts as ${exportName}`
        )
      }
    })
  })
})
