/**
 * @typedef PostData
 * @property {string} slug
 * @property {import("gray-matter").GrayMatterFile<any>} frontmatter
 */

/**
 * @typedef Route
 * @property {string} page - The page inside the `pages` directory to render.
 * @property {object=} query - The query object passed to `getInitialProps` when prerendering. Defaults to `{}`.
 */

/**
 * @typedef ExportPathMapParameters
 * @property {boolean} dev - `true` when `exportPathMap` is being called in development. `false` when running `next export`.
 * @property {string} dir - Absolute path to the project directory.
 * @property {string} outDir - Absolute path to the `out/` directory (configurable with `-o`). When `dev` is `true` the value of `outDir` will be `null`.
 * @property {string} distDir - Absolute path to the `.next/` directory (configurable with the `distDir` config).
 * @property {string} buildId - The generated build id.
 */

/**
 * @param {Object.<string, Route>} defaultPathMap - The default map used by Next.js.
 * @param {ExportPathMapParameters} parameters - An object with the configurations of the current build.
 * @return {Promise<Object.<string, Route>>}
 */
const exportPathMap = async (defaultPathMap, config) => {
  const getMarkdownFiles = require("./markdown.js");

  /** @type {Object.<string, Route>} */
  const paths = {
    "/about": { page: "/about", query: { title: "About" } }
  };

  // If I wanted a blog I would copy everything below this line

  /** @type {PostData[]} */
  const projects = [];
  const files = await getMarkdownFiles("./projects");

  files.forEach(file => {
    paths[`/project/${file.slug}`] = {
      page: "/project/[slug]",
      query: file
    };

    const { slug, frontmatter } = file;
    projects.push({ slug, frontmatter });
  });

  paths["/portfolio"] = { page: "/portfolio", query: { title: "Portfolio", projects } };

  return paths;
};

/**
 * @typedef {import('webpack')} WebPack
 */

/**
 * @typedef WebPackParameters
 * @property {boolean} dev - `true` when `exportPathMap` is being called in development. `false` when running `next export`.
 * @property {boolean} isServer - It's `true` for server-side compilation, and `false` for client-side compilation.
 * @property {string} buildId - The generated build id.
 * @property {object} defaultLoaders - Default loaders used internally by Next.js (babel).
 * @property {WebPack} webpack - The WebPack instance used by Next.js (no need to require it).
 */

/**
 * @param {WebPack.Configuration} config
 * @param {WebPackParameters} pararmeters
 * @return {WebPackConfig}
 */
const webpack = (config, { webpack }) => {
  const ignores = /^(marked|highlight\.js|gray-matter|dompurify|jsdom|fs)$/gim;

  config.plugins.push(new webpack.IgnorePlugin(ignores));

  return config;
};

module.exports = {
  webpack,
  exportPathMap
};
