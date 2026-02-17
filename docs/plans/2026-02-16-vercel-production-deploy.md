# Vercel Production Deployment (GitHub Integration) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Triển khai ứng dụng RoPhim lên Vercel thông qua kết nối GitHub trực tiếp, đảm bảo kiến trúc Monorepo được cấu hình chuẩn xác để tự động build và deploy.

**Architecture:** Sử dụng kiến trúc Monorepo với Turborepo và PNPM Workspaces. Vercel sẽ đóng vai trò là CI/CD pipeline, tự động quét folder `apps/web` làm thư mục gốc (Root Directory) và thực thi lệnh build trong môi trường workspace sạch.

**Tech Stack:** Next.js 16, Turborepo, PNPM, GitHub, Vercel.

---

### Task 1: Dọn dẹp cấu hình local và chuẩn bị Workspace

**Files:**
- Modify: `d:\rophim\.gitignore`
- Delete: `d:\rophim\vercel.json`
- Delete: `d:\rophim\apps\web\vercel.json`
- Modify: `d:\rophim\package.json`

**Step 1: Cập nhật .gitignore**
Đảm bảo `.vercel` và các build artifacts được bỏ qua đúng cách.

**Step 2: Xóa các file vercel.json**
Xóa `d:\rophim\vercel.json` và `d:\rophim\apps\web\vercel.json` để sử dụng cấu hình trực tiếp trên Dashboard.

**Step 3: Đồng bộ hóa lockfile và commit**
Run: `pnpm install`
Run: `git add .`
Run: `git commit -m "chore: professional monorepo cleanup for vercel production"`
Run: `git push origin main`

---

### Task 2: Project Settings Configuration (Manual Step for User)

**Goal:** Cấu hình dự án trên Vercel Dashboard để nhận diện Monorepo.

**Settings:**
1. **Root Directory:** `apps/web`
2. **Build Command:** `pnpm build`
3. **Install Command:** `pnpm install`

---

### Task 3: Verification

**Goal:** Kiểm tra website đã live và hoạt động đúng logic.
1. Truy cập URL và verify giao diện.
2. Kiểm tra log build trên Vercel.
