// Webpack loader: rewrites Sanity's plain `useEffectEvent` to
// `experimental_useEffectEvent` so it matches Next.js's bundled
// react-experimental (which only exports the prefixed name).
module.exports = function (source) {
  return source.replace(/\buseEffectEvent\b/g, "experimental_useEffectEvent");
};
