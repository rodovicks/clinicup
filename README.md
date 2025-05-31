# ClinicUp

ClinicUp é uma aplicação web projetada para otimizar os processos de gestão de clínicas. Construída com tecnologias modernas, oferece uma interface amigável para gerenciar consultas, usuários, exames e configurações.

## Funcionalidades

- **Gestão de Usuários**: Adicione, edite e gerencie usuários.
- **Consultas**: Agende e gerencie consultas.
- **Exames**: Gerencie registros de exames.
- **Configurações**: Personalize as configurações do aplicativo.
- **Design Responsivo**: Otimizado para diversos dispositivos.

## Tecnologias Utilizadas

- **Framework**: [Next.js](https://nextjs.org/) (v14.2.3)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) (v3.4.1)
- **Formulários**: [React Hook Form](https://react-hook-form.com/) com validação [Yup](https://github.com/jquense/yup)
- **Componentes de UI**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-repo/clinicup.git
   cd clinicup
   ```

2. Instale as dependências:

   ```bash
   pnpm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   pnpm dev
   ```

4. Abra o navegador e acesse `http://localhost:3000`.

## Scripts

- `pnpm dev`: Inicia o servidor de desenvolvimento.
- `pnpm build`: Compila a aplicação para produção.
- `pnpm start`: Inicia o servidor de produção.
- `pnpm lint`: Executa verificações do ESLint.

## Estrutura de Pastas

```
src/
├── app/
│   ├── (private)/
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   └── newUser.tsx
│   │   │   └── page.tsx
│   │   ├── appoiments/
│   │   ├── dashboard/
│   │   ├── exams/
│   │   └── settings/
│   ├── (public)/
│   │   └── login/
├── components/
│   ├── template/
│   └── ui/
├── hooks/
├── lib/
```
