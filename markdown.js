const fs = require("fs");
const path = require("path");

const matter = require("gray-matter");
const marked = require("marked");
const { JSDOM } = require("jsdom");
const purify = require("dompurify")(new JSDOM("").window);
const highlighter = require("highlight.js");
const slugify = require("slug");

const renderer = new marked.Renderer();

renderer.code = function(code, language){
  const highlighted = highlighter.highlight(language, code).value
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

marked.setOptions({
  renderer: renderer
})

/**
 * @typedef {import("gray-matter").GrayMatterFile<any>} FrontMatter
 */

/**
 * @typedef {Object} Markdown
 * @property {string} slug
 * @property {string} content
 * @property {string} title
 * @property {FrontMatter} frontmatter
 */

/**
 * @param {string} filepath
 * @param {string} filename
 * @return {Promise<Markdown>}
 */
const getMarkdown = async filepath => {
  /**
   * @type {string}
   */
  const file = await new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });

  const frontmatter = matter(file);

  /**
   * @type {string}
   */
  let content = await new Promise((resolve, reject) => {
    marked(file, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

  content = purify.sanitize(content);

  // Get the slug from the file name.
  const slug = slugify(path.parse(filepath).name, {lower: true});

  return {
    slug,
    frontmatter,
    content,
    title: frontmatter.title ? frontmatter.title : ''
  };
};

/**
 * @param {string} dirpath
 * @return {Promise<Array<Markdown>>}
 */
module.exports = async dirpath => {
  /**
   * @type {Array<string>}
   */
  const paths = await new Promise((resolve, reject) => {
    fs.readdir(dirpath, (err, files) => {
      if (err) return reject(err);

      resolve(
        files.filter(filename => {
          const extension = path.parse(filename).ext;
          return extension === ".md" || extension === ".markdown";
        })
      );
    });
  });

  return await Promise.all(
    paths.map(filename => {
      return getMarkdown(path.join(dirpath, filename));
    })
  );
};
