---
layout: page
title: "New York Daily News Coverage"
permalink: /media/new-york-daily-news/
description: "Editorials and reporting from the New York Daily News on Jonathan Cervas's redistricting work and New York's congressional and State Senate maps."
---

<p class="section-lead">Editorials and reporting from the <em>New York Daily News</em> editorial board and its reporters on New York's redistricting and the court-drawn maps.</p>

<h2>Editorials</h2>
<ul class="media-list">
  {% for m in site.data.media.nydn.editorials %}
  <li><span class="media-date">{{ m.display_date }}</span> &mdash; <a href="{{ m.url }}">{{ m.title }}</a></li>
  {% endfor %}
</ul>

<h2>Other Coverage</h2>
<ul class="media-list">
  {% for m in site.data.media.nydn.others %}
  <li><span class="media-date">{{ m.display_date }}</span> &mdash; <a href="{{ m.url }}">{{ m.title }}</a>{% if m.author %}, {{ m.author }}{% endif %}</li>
  {% endfor %}
</ul>
