# RoPhim - Modern Film Streaming Monorepo 🎬

![Demo Screenshot](apps/web/public/demo.png)

Chào mừng bạn đến với **RoPhim**, một nền tảng xem phim trực tuyến hiện đại được xây dựng trên kiến trúc **Monorepo** mạnh mẽ và linh hoạt. Dự án được tối ưu hóa cho tốc độ, SEO và trải nghiệm người dùng tuyệt vời.

---

## 🏛️ Kiến Trúc Hệ Thống (Architecture)

Dự án sử dụng mô hình **Monorepo** được quản lý bởi **Turborepo** và **pnpm workspaces**, giúp quản lý code tập trung nhưng vẫn đảm bảo tính module hóa cao.

```mermaid
graph TD
    subgraph "Root (Monorepo)"
        A[package.json] --> B[pnpm-workspace.yaml]
        A --> C[turbo.json]
    end

    subgraph "Apps"
        D[apps/web - Next.js App]
        E[apps/server - NestJS Backend]
    end

    subgraph "Packages (Shared)"
        F[@repo/ui - Styled Components]
        G[@repo/eslint-config]
        H[@repo/typescript-config]
    end

    D --> F
    D --> G
    D --> H
    E --> G
    E --> H
```

### Chi tiết các thư mục chính:
*   **`apps/web`**: Ứng dụng Front-end chính sử dụng **Next.js 15+ (Turbopack)**. Xử lý toàn bộ logic giao diện, routing và kết nối API.
*   **`apps/server`**: Backend xử lý các tác vụ nghiệp vụ, database và API layer (sử dụng NestJS).
*   **`packages/ui`**: Thư viện component dùng chung, được xây dựng bằng Tailwind CSS và Radix UI.
*   **`packages/config-*`**: Standardized configurations cho ESLint và TypeScript trên toàn dự án.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

Dự án quy tụ những công nghệ hiện đại nhất trong hệ sinh thái JavaScript/TypeScript:

| Lớp (Layer) | Công nghệ chính |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router), NestJS |
| **Monorepo Tool** | Turborepo, pnpm Workspaces |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **State & API** | React Server Components, Parallel Fetching |
| **Video Player** | Artplayer.js, Hls.js (M3U8 support) |
| **UI Components** | Radix UI, Lucide Icons, Swiper.js |
| **Quality** | TypeScript 5, ESLint, Prettier |
| **Deployment** | Vercel (Production optimized) |

---

## ✨ Tính Năng Nổi Bật

- **Tốc độ vượt trội**: Tận dụng tối đa Turbopack và Next.js RSC cho thời gian phản hồi cực nhanh.
- **Thiết kế cao cấp**: Giao diện mang đậm phong cách giải trí hiện đại, mượt mà với nhiều hiệu ứng đặc biệt.
- **Tối ưu SEO**: Metadata động, cấu trúc HTML5 chuẩn xác giúp đạt điểm số cao trên các công cụ tìm kiếm.
- **Hỗ trợ đa nền tảng**: Responsive hoàn hảo trên Mobile, Tablet và Desktop.

---

## 🛠️ Hướng Dẫn Cài Đặt

1. **Cài đặt dependencies:**
   ```bash
   pnpm install
   ```

2. **Chạy môi trường phát triển (Development):**
   ```bash
   pnpm dev
   ```

3. **Build dự án cho sản xuất:**
   ```bash
   pnpm build
   ```

---

*Phát triển và duy trì bởi **locfaker (@locv2659@gmail.com)**.*
