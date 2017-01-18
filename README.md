# forFrame_tools

This is a collection of tools, and prototypes in the works, that help me with my [forFrame.js](https://github.com/stintosestudios/forFrame), and [hexosite_source](https://github.com/stintosestudios/hexo_sitesource) projects. Which is all used to build my [github pages](https://stintosestudios.github.io/) site.

## hexo_markdown

This is a tool that I have made that helps to automate the process of building gallery pages for my site. It uses the guthub API to scan for all repo's that start with "forFrame_collection", and builds markdown files like this:

```
---
title: forFrame_collection_1_0_42 GIF collection
layout: page
---

{% forframe_thumbs collection_1_0_42 chicken;circle_pointer;fractal_1;logo;sections;the_canvas %}
```

This markdown file is then processed by a hexo.io tag of mine that is used to update a gallery page for all of my forFrame.js projects, for all forFrame repo collections. This is one of many projects that will hopfully save me a great deal of time.

it can be called dirrectly from the command line like so, with or without an access token:

```bash
$ node hexo_markdown.js token
```

If all goes well, a source folder will be generated. Inside the source folder is a gif folder that will go into the source folder of my hexo project. The gif folder should contain a markdown file for each of my forFrame GIF collections. These markdown files will then be processed by hexo, when building my site.

## github

This is what I use to get updated information about my forFrame_collection repo's.

```bash
$ node github.js token
```