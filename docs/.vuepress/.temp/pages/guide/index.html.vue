<template><div><h1 id="h1-heading" tabindex="-1"><a class="header-anchor" href="#h1-heading"><span>h1 Heading 😎</span></a></h1>
<h2 id="h2-heading" tabindex="-1"><a class="header-anchor" href="#h2-heading"><span>h2 Heading</span></a></h2>
<h3 id="h3-heading" tabindex="-1"><a class="header-anchor" href="#h3-heading"><span>h3 Heading</span></a></h3>
<h4 id="h4-heading" tabindex="-1"><a class="header-anchor" href="#h4-heading"><span>h4 Heading</span></a></h4>
<h5 id="h5-heading" tabindex="-1"><a class="header-anchor" href="#h5-heading"><span>h5 Heading</span></a></h5>
<h6 id="h6-heading" tabindex="-1"><a class="header-anchor" href="#h6-heading"><span>h6 Heading</span></a></h6>
<h2 id="horizontal-rules" tabindex="-1"><a class="header-anchor" href="#horizontal-rules"><span>Horizontal Rules</span></a></h2>
<hr>
<hr>
<hr>
<h2 id="typographic-replacements" tabindex="-1"><a class="header-anchor" href="#typographic-replacements"><span>Typographic replacements</span></a></h2>
<p>Enable typographer option to see result.</p>
<p>(c) (C) (r) (R) (tm) (TM) (p) (P) +-</p>
<p>test.. test... test..... test?..... test!....</p>
<p>!!!!!! ???? ,,  -- ---</p>
<p>&quot;Smartypants, double quotes&quot; and 'single quotes'</p>
<h2 id="emphasis" tabindex="-1"><a class="header-anchor" href="#emphasis"><span>Emphasis</span></a></h2>
<p><strong>This is bold text</strong></p>
<p><strong>This is bold text</strong></p>
<p><em>This is italic text</em></p>
<p><em>This is italic text</em></p>
<p><s>Strikethrough</s></p>
<h2 id="blockquotes" tabindex="-1"><a class="header-anchor" href="#blockquotes"><span>Blockquotes</span></a></h2>
<blockquote>
<p>Blockquotes can also be nested...</p>
<blockquote>
<p>...by using additional greater-than signs right next to each other...</p>
<blockquote>
<p>...or with spaces between arrows.</p>
</blockquote>
</blockquote>
</blockquote>
<h2 id="lists" tabindex="-1"><a class="header-anchor" href="#lists"><span>Lists</span></a></h2>
<p>Unordered</p>
<ul>
<li>Create a list by starting a line with <code v-pre>+</code>, <code v-pre>-</code>, or <code v-pre>*</code></li>
<li>Sub-lists are made by indenting 2 spaces:
<ul>
<li>Marker character change forces new list start:
<ul>
<li>Ac tristique libero volutpat at</li>
</ul>
<ul>
<li>Facilisis in pretium nisl aliquet</li>
</ul>
<ul>
<li>Nulla volutpat aliquam velit</li>
</ul>
</li>
</ul>
</li>
<li>Very easy!</li>
</ul>
<p>Ordered</p>
<ol>
<li>
<p>Lorem ipsum dolor sit amet</p>
</li>
<li>
<p>Consectetur adipiscing elit</p>
</li>
<li>
<p>Integer molestie lorem at massa</p>
</li>
<li>
<p>You can use sequential numbers...</p>
</li>
<li>
<p>...or keep all the numbers as <code v-pre>1.</code></p>
</li>
</ol>
<p>Start numbering with offset:</p>
<ol start="57">
<li>foo</li>
<li>bar</li>
</ol>
<h2 id="code" tabindex="-1"><a class="header-anchor" href="#code"><span>Code</span></a></h2>
<p>Inline <code v-pre>code</code></p>
<p>Indented code</p>
<pre><code>// Some comments
line 1 of code
line 2 of code
line 3 of code
</code></pre>
<p>Block code &quot;fences&quot;</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>Sample text here...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Syntax highlighting</p>
<div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> <span class="token function-variable function">foo</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">bar</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> bar<span class="token operator">++</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">foo</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="tables" tabindex="-1"><a class="header-anchor" href="#tables"><span>Tables</span></a></h2>
<table>
<thead>
<tr>
<th>Option</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>data</td>
<td>path to data files to supply the data that will be passed into templates.</td>
</tr>
<tr>
<td>engine</td>
<td>engine to be used for processing templates. Handlebars is the default.</td>
</tr>
<tr>
<td>ext</td>
<td>extension to be used for dest files.</td>
</tr>
</tbody>
</table>
<p>Right aligned columns</p>
<table>
<thead>
<tr>
<th style="text-align:right">Option</th>
<th style="text-align:right">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:right">data</td>
<td style="text-align:right">path to data files to supply the data that will be passed into templates.</td>
</tr>
<tr>
<td style="text-align:right">engine</td>
<td style="text-align:right">engine to be used for processing templates. Handlebars is the default.</td>
</tr>
<tr>
<td style="text-align:right">ext</td>
<td style="text-align:right">extension to be used for dest files.</td>
</tr>
</tbody>
</table>
<h2 id="links" tabindex="-1"><a class="header-anchor" href="#links"><span>Links</span></a></h2>
<p><a href="http://dev.nodeca.com" target="_blank" rel="noopener noreferrer">link text<ExternalLinkIcon/></a></p>
<p><a href="http://nodeca.github.io/pica/demo/" title="title text!" target="_blank" rel="noopener noreferrer">link with title<ExternalLinkIcon/></a></p>
<p>Autoconverted link https://github.com/nodeca/pica (enable linkify to see)</p>
<h2 id="images" tabindex="-1"><a class="header-anchor" href="#images"><span>Images</span></a></h2>
<p><img src="https://octodex.github.com/images/minion.png" alt="Minion">
<img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat" title="The Stormtroopocat"></p>
<p>Like links, Images also have a footnote style syntax</p>
<p><img src="https://octodex.github.com/images/dojocat.jpg" alt="Alt text" title="The Dojocat"></p>
<p>With a reference later in the document defining the URL location:</p>
<h2 id="plugins" tabindex="-1"><a class="header-anchor" href="#plugins"><span>Plugins</span></a></h2>
<p>The killer feature of <code v-pre>markdown-it</code> is very effective support of
<a href="https://www.npmjs.org/browse/keyword/markdown-it-plugin" target="_blank" rel="noopener noreferrer">syntax plugins<ExternalLinkIcon/></a>.</p>
<h3 id="emojies" tabindex="-1"><a class="header-anchor" href="#emojies"><span><a href="https://github.com/markdown-it/markdown-it-emoji" target="_blank" rel="noopener noreferrer">Emojies<ExternalLinkIcon/></a></span></a></h3>
<blockquote>
<p>Classic markup: 😉 😢 😆 😋</p>
<p>Shortcuts (emoticons): 😃 😦 😎 😉</p>
</blockquote>
<p>see <a href="https://github.com/markdown-it/markdown-it-emoji#change-output" target="_blank" rel="noopener noreferrer">how to change output<ExternalLinkIcon/></a> with twemoji.</p>
<h3 id="subscript-superscript" tabindex="-1"><a class="header-anchor" href="#subscript-superscript"><span><a href="https://github.com/markdown-it/markdown-it-sub" target="_blank" rel="noopener noreferrer">Subscript<ExternalLinkIcon/></a> / <a href="https://github.com/markdown-it/markdown-it-sup" target="_blank" rel="noopener noreferrer">Superscript<ExternalLinkIcon/></a></span></a></h3>
<ul>
<li>19^th^</li>
<li>H~2~O</li>
</ul>
<h3 id="ins" tabindex="-1"><a class="header-anchor" href="#ins"><span><a href="https://github.com/markdown-it/markdown-it-ins" target="_blank" rel="noopener noreferrer">&lt;ins&gt;<ExternalLinkIcon/></a></span></a></h3>
<p>++Inserted text++</p>
<h3 id="mark" tabindex="-1"><a class="header-anchor" href="#mark"><span><a href="https://github.com/markdown-it/markdown-it-mark" target="_blank" rel="noopener noreferrer">&lt;mark&gt;<ExternalLinkIcon/></a></span></a></h3>
<p>==Marked text==</p>
<h3 id="footnotes" tabindex="-1"><a class="header-anchor" href="#footnotes"><span><a href="https://github.com/markdown-it/markdown-it-footnote" target="_blank" rel="noopener noreferrer">Footnotes<ExternalLinkIcon/></a></span></a></h3>
<p>Footnote 1 link[^first].</p>
<p>Footnote 2 link[^second].</p>
<p>Inline footnote^[Text of inline footnote] definition.</p>
<p>Duplicated footnote reference[^second].</p>
<p>[^first]: Footnote <strong>can have markup</strong></p>
<pre><code>and multiple paragraphs.
</code></pre>
<p>[^second]: Footnote text.</p>
<h3 id="definition-lists" tabindex="-1"><a class="header-anchor" href="#definition-lists"><span><a href="https://github.com/markdown-it/markdown-it-deflist" target="_blank" rel="noopener noreferrer">Definition lists<ExternalLinkIcon/></a></span></a></h3>
<p>Term 1</p>
<p>:   Definition 1
with lazy continuation.</p>
<p>Term 2 with <em>inline markup</em></p>
<p>:   Definition 2</p>
<pre><code>    { some code, part of Definition 2 }

Third paragraph of definition 2.
</code></pre>
<p><em>Compact style:</em></p>
<p>Term 1
~ Definition 1</p>
<p>Term 2
~ Definition 2a
~ Definition 2b</p>
<h3 id="abbreviations" tabindex="-1"><a class="header-anchor" href="#abbreviations"><span><a href="https://github.com/markdown-it/markdown-it-abbr" target="_blank" rel="noopener noreferrer">Abbreviations<ExternalLinkIcon/></a></span></a></h3>
<p>This is HTML abbreviation example.</p>
<p>It converts &quot;HTML&quot;, but keep intact partial entries like &quot;xxxHTMLyyy&quot; and so on.</p>
<p>*[HTML]: Hyper Text Markup Language</p>
<h3 id="custom-containers" tabindex="-1"><a class="header-anchor" href="#custom-containers"><span><a href="https://github.com/markdown-it/markdown-it-container" target="_blank" rel="noopener noreferrer">Custom containers<ExternalLinkIcon/></a></span></a></h3>
<div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p><em>here be dragons</em></p>
</div>
</div></template>


