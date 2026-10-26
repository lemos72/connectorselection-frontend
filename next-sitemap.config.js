/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://connectorselection.com',
  generateRobotsTxt: true,
  trailingSlash: true,
  outDir: './out',
  exclude: ['/ask-the-engineer/_no-questions-yet/'],
}