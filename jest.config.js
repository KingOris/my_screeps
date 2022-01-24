const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}