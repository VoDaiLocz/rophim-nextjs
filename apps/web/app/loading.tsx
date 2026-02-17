export default function Loading() {
    return (
        <main className="min-h-screen bg-[#0b0d14] text-white flex items-center justify-center fixed inset-0 z-[9999]">
            <div className="flex flex-col items-center gap-6">
                {/* Brand loader */}
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-white/5 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-t-[#ffd875] rounded-full animate-spin absolute top-0 left-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#ffd875] rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <h2 className="text-[#ffd875] text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                        Đang kết nối RoPhim...
                    </h2>
                    <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">
                        Chất lượng gốc • Tốc độ cao
                    </p>
                </div>
            </div>
        </main>
    );
}
