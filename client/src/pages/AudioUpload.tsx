import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  Music,
  AlertCircle,
  CheckCircle2,
  X,
  Volume2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

const ALLOWED_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export default function AudioUpload() {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUploadUrlMutation = trpc.audioUpload.getUploadUrl.useMutation();
  const registerUploadMutation = trpc.audioUpload.registerUpload.useMutation();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (selectedFiles: File[]) => {
    for (const file of selectedFiles) {
      // Validar tipo
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(
          `${file.name}: Tipo de arquivo não permitido. Use MP3, WAV, OGG ou MP4`
        );
        continue;
      }

      // Validar tamanho
      if (file.size > MAX_SIZE) {
        toast.error(
          `${file.name}: Arquivo muito grande (máx. ${formatFileSize(MAX_SIZE)})`
        );
        continue;
      }

      // Criar entrada de upload
      const uploadId = Math.random().toString(36).substring(7);
      const uploadFile: UploadingFile = {
        id: uploadId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading",
      };

      setFiles((prev) => [...prev, uploadFile]);

      // Simular upload com progresso
      await simulateUpload(uploadFile, file);
    }
  };

  const simulateUpload = async (uploadFile: UploadingFile, file: File) => {
    try {
      // Obter URL de upload
      const uploadUrl = await getUploadUrlMutation.mutateAsync({
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      });

      // Simular progresso de upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: Math.round(progress) } : f
          )
        );
      }, 300);

      // Simular delay de upload (em produção, seria o upload real)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearInterval(interval);

      // Registrar upload
      await registerUploadMutation.mutateAsync({
        fileKey: uploadUrl.fileKey,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        durationSeconds: Math.round(Math.random() * 300), // Simulado
      });

      // Marcar como sucesso
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, progress: 100, status: "success" }
            : f
        )
      );

      toast.success(`${file.name} enviado com sucesso!`);
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: "error",
                error: "Erro ao fazer upload do arquivo",
              }
            : f
        )
      );
      toast.error(`Erro ao fazer upload de ${file.name}`);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status === "uploading"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Upload de Áudio
          </h1>
          <p className="text-slate-600">
            Envie suas faixas de áudio (MP3, WAV, OGG, MP4) - até 100MB por arquivo
          </p>
        </div>

        {/* Upload Area */}
        <Card
          className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-slate-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center py-12">
            <Volume2 className="w-16 h-16 text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Arraste seus arquivos aqui
            </h2>
            <p className="text-slate-600 text-center mb-6 max-w-md">
              ou clique para selecionar arquivos de áudio do seu computador
            </p>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Arquivo
            </Button>
          </div>
        </Card>

        {/* Upload List */}
        {files.length > 0 && (
          <Card className="mt-8 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Uploads ({files.length})
              </h2>
              {files.some((f) => f.status === "success") && (
                <Button
                  onClick={clearCompleted}
                  variant="outline"
                  size="sm"
                  className="text-slate-600"
                >
                  Limpar Concluídos
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`p-4 rounded-lg border ${
                    file.status === "success"
                      ? "bg-green-50 border-green-200"
                      : file.status === "error"
                        ? "bg-red-50 border-red-200"
                        : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Music className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold text-slate-900">
                          {file.name}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status === "uploading" && (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      )}
                      {file.status === "success" && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}

                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        <X className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        file.status === "success"
                          ? "bg-green-600"
                          : file.status === "error"
                            ? "bg-red-600"
                            : "bg-blue-600"
                      }`}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-slate-600">
                      {file.status === "uploading"
                        ? `${file.progress}%`
                        : file.status === "success"
                          ? "Concluído"
                          : "Erro"}
                    </span>
                    {file.error && (
                      <span className="text-sm text-red-600">{file.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info Box */}
        <Alert className="mt-8 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Dica:</strong> Você pode fazer upload de múltiplos arquivos
            de uma vez. Formatos suportados: MP3, WAV, OGG, MP4. Tamanho máximo:
            100MB por arquivo.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
