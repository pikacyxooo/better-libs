module.exports = {
  title: "better-libs",
  description: "一个前端工具库",
  themeConfig: {
    docsDir: "packages/docs/",
    editLinks: true,
    smoothScroll: true,
    nav: [{ text: "指南", link: "/guide/" }],
    sidebar: {
      "/guide/": [
        {
          isGroup: true,
          text: "指南",
          children: ["/guide/README.md", "/guide/install.md", "/guide/use.md"],
        },
      ],
    },
  },
};
