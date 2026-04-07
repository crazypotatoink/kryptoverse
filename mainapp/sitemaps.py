from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class StaticViewSitemap(Sitemap):
    """
    Covers all public, crawlable pages on KryptoVerse.
    Authenticated-only and admin routes are intentionally excluded.
    """
    protocol = "https"
    changefreq = "weekly"
    priority = 0.8

    # (url_name, priority_override, changefreq_override)
    _pages = [
        ("index",   1.0,  "daily"),
        ("login",   0.6,  "monthly"),
        ("signup",  0.7,  "monthly"),
        ("contact", 0.5,  "monthly"),
        ("terms",   0.3,  "yearly"),
        ("privacy", 0.3,  "yearly"),
    ]

    def items(self):
        return self._pages

    def location(self, item):
        return reverse(item[0])

    def priority(self, item):
        return item[1]

    def changefreq(self, item):
        return item[2]
