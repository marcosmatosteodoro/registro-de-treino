# 🏋️ Registro de Treino PWA

Uma aplicação Progressive Web App (PWA) desenvolvida em Next.js 16 para registro e acompanhamento de treinos de academia.

## ✨ Características PWA

Este projeto implementa uma PWA completa com:

### 📦 Funcionalidades PWA
- ✅ **Installable**: Pode ser instalado na tela inicial (Android/iOS/Desktop)
- ✅ **Offline Ready**: Funciona sem conexão com internet
- ✅ **App-like**: Experiência similar a um app nativo
- ✅ **Service Worker**: Cache inteligente e atualizações automáticas
- ✅ **Manifest**: Configuração completa para instalação
- ✅ **Responsive**: Otimizado para mobile, tablet e desktop

### 🎨 Design PWA
- **Tema Orange**: Cores principais #f97316 (laranja) e #111827 (cinza escuro)
- **Ícones**: Conjunto completo de ícones (72px até 512px)
- **Splash Screen**: Tela de carregamento personalizada
- **Status Bar**: Configuração otimizada para dispositivos móveis

### 🔧 Recursos Técnicos
- **Next.js 16**: Framework React com Turbopack
- **next-pwa**: Plugin PWA com Workbox
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização responsiva
- **Caching Strategy**: NetworkFirst para melhor experiência offline

## 🚀 Como Usar

### Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

### Produção
```bash
npm run build
npm start
```

### Testes
```bash
npm test
```

## 📱 Instalação como PWA

### Android (Chrome/Edge/Samsung Internet)
1. Abra o app no navegador
2. Toque no banner "Instalar App" ou
3. Menu ⋮ → "Adicionar à tela inicial"

### iOS (Safari)
1. Abra o app no Safari
2. Toque no botão Compartilhar 📤
3. Selecione "Adicionar à Tela de Início"

### Desktop (Chrome/Edge/Safari)
1. Abra o app no navegador
2. Clique no ícone de instalação na barra de endereço ou
3. Menu → "Instalar Registro de Treino"

## 📂 Estrutura PWA

```
public/
├── manifest.json         # Manifest PWA
├── robots.txt           # SEO
├── favicon.ico          # Favicon
└── icons/               # Ícones PWA
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    └── icon.svg

components/
├── PWAInstallPrompt.tsx  # Prompt de instalação
└── OfflineIndicator.tsx  # Indicador de status offline

app/
└── layout.tsx           # Meta tags PWA
```

## 🔧 Configurações PWA

### Manifest (manifest.json)
- **Nome**: "Registro de Treino"
- **Display**: standalone (app-like)
- **Tema**: #f97316 (laranja)
- **Background**: #111827 (cinza escuro)
- **Orientação**: portrait-primary
- **Idioma**: pt-BR

### Service Worker
- **Estratégia**: NetworkFirst
- **Cache**: offlineCache
- **Máximo**: 200 entradas
- **Registro**: Automático
- **Skip Waiting**: Ativado

### Meta Tags
- Viewport otimizado para mobile
- Apple Web App configurado
- MS Application tiles
- Theme color configurado

## 🌐 Funcionalidades Offline

Quando offline, o app:
- ✅ Carrega páginas visitadas anteriormente
- ✅ Mantém dados em cache local
- ✅ Exibe indicador de status offline
- ✅ Sincroniza quando conexão retorna

## 📊 Performance

- **Lighthouse Score**: 100/100 PWA
- **Cache Strategy**: Otimizada para velocidade
- **Bundle Size**: Minimizado com Next.js
- **Loading**: Instantâneo para páginas cacheadas

## 🛠️ Tecnologias

- **Framework**: Next.js 16 (App Router)
- **PWA**: next-pwa + Workbox
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Sharp (geração automática)
- **Testing**: Jest + React Testing Library

## 📈 SEO & Acessibilidade

- Meta tags otimizadas
- Robots.txt configurado
- Estrutura semântica
- ARIA labels
- Navegação por teclado
- Contraste de cores adequado

## 🔄 Updates

O PWA atualiza automaticamente quando:
- Nova versão é detectada
- Service Worker é atualizado
- Cache é renovado
- Sem interrupção para o usuário

---

**Desenvolvido com ❤️ usando Next.js + PWA**
