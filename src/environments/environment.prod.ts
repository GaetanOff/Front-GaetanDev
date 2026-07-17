export const environment = {
  production: true,
  sso: {
    baseUrl: 'https://sso.gaetandev.fr',
    clientId: 'client_089c6909ed1844fc',
    redirectUri: 'https://gaetandev.fr/admin/auth/callback',
    scopes: 'openid profile email',
  },
  apiBaseUrl: 'https://api.gaetandev.fr',
  chatbotApiUrl: 'https://api-ia-chatbot-portfolio.gaetandev.fr',
  emailjs: {
    serviceId: 'service_katu34t',
    templateId: 'template_3rprude',
    publicKey: 'SsUfOyd0KywiMRRLl',
  },
};
