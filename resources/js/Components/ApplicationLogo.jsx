export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <div className={`flex items-center gap-3 ${className}`} {...props}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3C473A] shadow-lg transform rotate-3">
                <span className="text-2xl font-bold text-[#FDF6F0]">A</span>
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-[#2B221E] uppercase leading-none">
                    AKINO<span className="text-[#D77A61]">MASS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3C473A]/60 mt-1">
                    Multichannel System
                </span>
            </div>
        </div>
    );
}

