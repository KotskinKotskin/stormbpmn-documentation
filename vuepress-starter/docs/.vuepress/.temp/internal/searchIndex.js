export const searchIndex = [
  {
    "title": "С чего начать",
    "headers": [
      {
        "level": 2,
        "title": "Pages",
        "slug": "pages",
        "link": "#pages",
        "children": []
      },
      {
        "level": 2,
        "title": "Content",
        "slug": "content",
        "link": "#content",
        "children": []
      },
      {
        "level": 2,
        "title": "Configuration",
        "slug": "configuration",
        "link": "#configuration",
        "children": []
      },
      {
        "level": 2,
        "title": "Layouts and customization",
        "slug": "layouts-and-customization",
        "link": "#layouts-and-customization",
        "children": []
      }
    ],
    "path": "/get-started.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Главная страница",
    "headers": [],
    "path": "/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "h1 Heading 😎",
    "headers": [
      {
        "level": 2,
        "title": "h2 Heading",
        "slug": "h2-heading",
        "link": "#h2-heading",
        "children": [
          {
            "level": 3,
            "title": "h3 Heading",
            "slug": "h3-heading",
            "link": "#h3-heading",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "Horizontal Rules",
        "slug": "horizontal-rules",
        "link": "#horizontal-rules",
        "children": []
      },
      {
        "level": 2,
        "title": "Typographic replacements",
        "slug": "typographic-replacements",
        "link": "#typographic-replacements",
        "children": []
      },
      {
        "level": 2,
        "title": "Emphasis",
        "slug": "emphasis",
        "link": "#emphasis",
        "children": []
      },
      {
        "level": 2,
        "title": "Blockquotes",
        "slug": "blockquotes",
        "link": "#blockquotes",
        "children": []
      },
      {
        "level": 2,
        "title": "Lists",
        "slug": "lists",
        "link": "#lists",
        "children": []
      },
      {
        "level": 2,
        "title": "Code",
        "slug": "code",
        "link": "#code",
        "children": []
      },
      {
        "level": 2,
        "title": "Tables",
        "slug": "tables",
        "link": "#tables",
        "children": []
      },
      {
        "level": 2,
        "title": "Links",
        "slug": "links",
        "link": "#links",
        "children": []
      },
      {
        "level": 2,
        "title": "Images",
        "slug": "images",
        "link": "#images",
        "children": []
      },
      {
        "level": 2,
        "title": "Plugins",
        "slug": "plugins",
        "link": "#plugins",
        "children": [
          {
            "level": 3,
            "title": "Emojies",
            "slug": "emojies",
            "link": "#emojies",
            "children": []
          },
          {
            "level": 3,
            "title": "Subscript / Superscript",
            "slug": "subscript-superscript",
            "link": "#subscript-superscript",
            "children": []
          },
          {
            "level": 3,
            "title": "<ins>",
            "slug": "ins",
            "link": "#ins",
            "children": []
          },
          {
            "level": 3,
            "title": "<mark>",
            "slug": "mark",
            "link": "#mark",
            "children": []
          },
          {
            "level": 3,
            "title": "Footnotes",
            "slug": "footnotes",
            "link": "#footnotes",
            "children": []
          },
          {
            "level": 3,
            "title": "Definition lists",
            "slug": "definition-lists",
            "link": "#definition-lists",
            "children": []
          },
          {
            "level": 3,
            "title": "Abbreviations",
            "slug": "abbreviations",
            "link": "#abbreviations",
            "children": []
          },
          {
            "level": 3,
            "title": "Custom containers",
            "slug": "custom-containers",
            "link": "#custom-containers",
            "children": []
          }
        ]
      }
    ],
    "path": "/guide/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/404.html",
    "pathLocale": "/",
    "extraFields": []
  }
]

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSearchIndex) {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ searchIndex }) => {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  })
}
