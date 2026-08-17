"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CheckCircle2, Download, Eye, FileText, UploadCloud, X } from "lucide-react";

const items = ["Laboratory Safety & Equipment", "Course File Completeness", "Research Publications", "Placement & Career Services"];
type Evidence = { name: string; url: string };

export default function DepartmentPage() {
  const [uploads, setUploads] = useState<Record<number, Evidence>>({});
  const [preview, setPreview] = useState<Evidence | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const uploadsRef = useRef<Record<number, Evidence>>({});
  const uploaded = Object.keys(uploads).length;
  const progress = Math.round((uploaded / items.length) * 100);

  useEffect(() => () => { Object.values(uploadsRef.current).forEach(({ url }) => URL.revokeObjectURL(url)); }, []);
  useEffect(() => { const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setPreview(null); }; window.addEventListener("keydown", closeOnEscape); return () => window.removeEventListener("keydown", closeOnEscape); }, []);

  function chooseFile(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const previous = uploadsRef.current[index];
    if (previous) { if (preview?.url === previous.url) setPreview(null); URL.revokeObjectURL(previous.url); }
    const evidence = { name: file.name, url: URL.createObjectURL(file) };
    const nextUploads = { ...uploadsRef.current, [index]: evidence };
    uploadsRef.current = nextUploads;
    setUploads(nextUploads);
    event.target.value = "";
  }

  return <AppShell>
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="page-title">Department Evidence Hub</h1><p className="mt-1 text-sm text-slate-500">Computer Science & Engineering · Audit Cycle 2026</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700"><CheckCircle2 size={14}/> Submission workspace</span></div>
    <section className="glass mt-6"><div className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-900">Overall submission progress</h2><p className="mt-1 text-xs text-slate-500">Each checklist item requires its own supporting PDF.</p></div><b className="text-sm text-teal-700">{uploaded} of {items.length} evidence items · {progress}%</b></div><div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500" style={{ width: `${progress}%` }}/></div></section>
    <section className="glass mt-5 overflow-hidden p-0"><div className="border-b px-5 py-4"><h2 className="font-bold text-slate-900">Evidence Submission Register</h2><p className="mt-1 text-xs text-slate-500">Upload approved PDF evidence and preview it without leaving AuditFlow.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="w-14 px-5 py-3 font-semibold">No.</th><th className="px-4 py-3 font-semibold">Checklist requirement</th><th className="w-[390px] px-4 py-3 font-semibold">Evidence status</th><th className="w-36 px-5 py-3 font-semibold">Action</th></tr></thead><tbody className="divide-y">{items.map((item, index) => { const evidence = uploads[index]; return <tr className="transition hover:bg-slate-50/80" key={item}><td className="px-5 py-4 text-slate-400">{String(index + 1).padStart(2, "0")}</td><td className="px-4 py-4 font-semibold text-slate-700">{item}</td><td className="px-4 py-4">{evidence ? <div className="flex items-center gap-2"><span className="inline-flex items-start gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-2 text-xs font-semibold text-emerald-800"><CheckCircle2 className="mt-0.5 shrink-0" size={15}/><button type="button" title={evidence.name} onClick={() => setPreview(evidence)} className="break-all text-left underline-offset-2 hover:underline">{evidence.name}</button></span><button type="button" onClick={() => setPreview(evidence)} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-teal-200 bg-white px-2.5 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50"><Eye size={14}/> View</button></div> : <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-2 text-xs font-semibold text-amber-800">Pending upload</span>}</td><td className="px-5 py-4"><input ref={element => { inputRefs.current[index] = element; }} onChange={event => chooseFile(index, event)} className="sr-only" type="file" accept="application/pdf,.pdf"/><button type="button" onClick={() => inputRefs.current[index]?.click()} className="inline-flex min-w-24 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"><UploadCloud size={14}/>{evidence ? "Replace" : "Upload"}</button></td></tr>; })}</tbody></table></div></section>
    {preview && <EvidencePreview evidence={preview} onClose={() => setPreview(null)}/>} 
  </AppShell>;
}

function EvidencePreview({ evidence, onClose }: { evidence: Evidence; onClose: () => void }) {
  return <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"><section role="dialog" aria-modal="true" aria-label={`Evidence Preview: ${evidence.name}`} className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl"><header className="flex items-center justify-between gap-4 border-b bg-slate-50 px-5 py-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600"><FileText size={20}/></span><div className="min-w-0"><p className="text-sm font-bold text-slate-900">Evidence Preview</p><p className="truncate text-xs text-slate-500" title={evidence.name}>{evidence.name}</p></div></div><div className="flex shrink-0 items-center gap-2"><a href={evidence.url} download={evidence.name} className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white transition hover:bg-[#163b60]"><Download size={15}/> <span className="hidden sm:inline">Download</span></a><button type="button" onClick={onClose} aria-label="Close preview" className="grid h-9 w-9 place-items-center rounded-lg border bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X size={18}/></button></div></header><div className="min-h-0 flex-1 bg-slate-100 p-3 sm:p-5"><iframe title={`PDF preview: ${evidence.name}`} src={evidence.url} className="h-full w-full rounded-lg border bg-white"/></div></section></div>;
}
