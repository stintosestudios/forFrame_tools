# forFrame_tools

This is a collection of tools, and prototypes in the works, that help me with my [forFrame.js](https://github.com/stintosestudios/forFrame), and [hexosite_source](https://github.com/stintosestudios/hexo_sitesource) projects. Which is all used to build my [github pages](https://stintosestudios.github.io/) site.

## autogif

This helps make exporting to gif real easy. One problem though is that the gifs are not optimized, so I still need to open them up in gimp to get that done.

## autogif_node

This tool that I put together not only helps with generating a gif, It also transmits the gif to a node server system that writes it to the file system. In addition it places the gif in a forFrame collection tree (/projects/[projectName]/gif), and if the path is not there it creates it. It also makes use of a command line program called gifsicle which is used to instantly create a bunch of different resolutions of the gif, that are also optimized.

This tool also contains a hacked over version of forFrame 1.5.x that may lead to forFrame 2.x. This forFrame hack job introduces a plug-in system that I will want to have with forFrame.

## autolinker

This is my first forframe tool. The goal was to automate the process of making a bunch of links to my forFrame gifs. It uses the github API to make an up to date list of all GIFs. Although I do not use it, autolinker has led to the development of my hexo_markdown, and github tools which I do use.

## hexo_markdown

This is a tool that I have made that helps to automate the process of building gallery pages for my site. It uses the guthub API to scan for all repo's that start with "forFrame_collection", and builds markdown files like this:

```
---
title: forFrame_collection_1_0_42 GIF collection
layout: page
---

{% forframe_thumbs collection_1_0_42 chicken;circle_pointer;fractal_1;logo;sections;the_canvas %}
```

This markdown file is then processed by a hexo.io tag of mine that is used to update a gallery page for all of my forFrame.js projects, for all forFrame repo collections. This is one of many projects that saves me a great deal of time.

it can be called directly from the command line like so, with or without an access token:

```bash
$ node hexo_markdown.js token
```

If all goes well, a source folder will be generated. Inside the source folder is a gif folder that will go into the source folder of my hexo project. The gif folder should contain a markdown file for each of my forFrame GIF collections. These markdown files will then be processed by hexo, when building my site.

## hexo_tags

This is what is used to generate html based on the markdown files that are built by using hexo_markdown. I just drop this file into my scripts folder of my hexo project's root name space.

## github

This is what I use to get updated information about my forFrame_collection repo's.

```bash
$ node github.js token
```