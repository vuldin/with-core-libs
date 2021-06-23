const withTM = require('next-transpile-modules')([
  'd3',
  'delaunator',
  'internmap',
  'robust-predicates',
])

module.exports = withTM()
