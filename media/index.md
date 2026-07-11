---
layout: page
title: "Media"
permalink: /media/
description: "News coverage and media mentions of Jonathan Cervas's redistricting and voting-rights work, from The New York Times, AP, Bloomberg, and more."
---

<details class="media-inquiries">
  <summary><strong>Media Inquiries</strong></summary>
  <address>
    <strong>Jonathan Cervas</strong><br>
    Assistant Teaching Professor<br>
    <a href="mailto:jcervas@andrew.cmu.edu">Email</a> &middot;
    <a href="tel:4122682900">412-268-2900</a>
  </address>
</details>

<p class="section-lead">News coverage and mentions. This list is updated continuously and may include forthcoming coverage.</p>

<h2>Featured</h2>
<div class="media-featured">
  {% for f in site.data.media.featured %}
  <article class="media-feature">
    <h3><a href="{{ f.url }}">{{ f.title }}</a></h3>
    <div class="media-outlet">{{ f.outlet }}</div>
    <p>{{ f.summary }}</p>
    <a class="more-link" href="{{ f.url }}">Read at {{ f.outlet }} &rarr;</a>
  </article>
  {% endfor %}
</div>

<h2>Media Mentions</h2>
{% for group in site.data.media.mentions_by_year %}
<h3 class="media-year">{{ group.year }}</h3>
<ul class="media-list">
  {% for m in group.items %}
  <li>
    <span class="media-date">{{ m.display_date }}</span> &mdash;
    <span class="media-src">{{ m.outlet }}</span>:
    {% if m.url %}<a href="{{ m.url }}">{{ m.title }}</a>{% else %}{{ m.title }}{% endif %}{% if m.author %}, by {{ m.author }}{% endif %}
    {% if m.quotes %}
    <ul class="media-quotes">
      {% for q in m.quotes %}<li>{{ q }}</li>{% endfor %}
    </ul>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endfor %}

<h2>New York Daily News</h2>
<h3 class="media-year">Editorials</h3>
<ul class="media-list">
  {% for m in site.data.media.nydn.editorials %}
  <li><span class="media-date">{{ m.display_date }}</span> &mdash; <a href="{{ m.url }}">{{ m.title }}</a></li>
  {% endfor %}
</ul>
<h3 class="media-year">Other Coverage</h3>
<ul class="media-list">
  {% for m in site.data.media.nydn.others %}
  <li><span class="media-date">{{ m.display_date }}</span> &mdash; <a href="{{ m.url }}">{{ m.title }}</a>{% if m.author %}, {{ m.author }}{% endif %}</li>
  {% endfor %}
</ul>
