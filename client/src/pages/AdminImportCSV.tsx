import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, AlertCircle, CheckCircle2, FileUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PreviewRow {
  rowNumber: number;
  isValid: boolean;
  data?: {
    title: string;
    artist: string;
    genre: string;
    duration: string;
  };
  errors: string[];
}

export default function AdminImportCSV() {
  const [csvContent, setCsvContent] = useState("");
  const [preview, setPreview] = useState<{
    totalRows: number;
    validRows: number;
    invalidRows: number;
    rows: PreviewRow[];
  } | null>(null);
  const [step, setStep] = useState<"upload" | "preview" | "importing">("upload");

  const previewMutation = trpc.csvImport.preview.useMutation();
  const importMutation = trpc.csvImport.import.useMutation();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
    };
    reader.readAsText(file);
  };

  const handlePreview = async () => {
    if (!csvContent.trim()) {
      toast.error("Por favor, selecione um arquivo CSV");
      return;
    }

    try {
      const result = await previewMutation.mutateAsync({ csvContent });
      setPreview(result);
      setStep("preview");
      toast.success(`Preview carregado: ${result.validRows} linhas válidas`);
    } catch (error) {
      toast.error("Erro ao fazer preview do CSV");
      console.error(error);
    }
  };

  const handleImport = async (skipInvalid: boolean) => {
    setStep("importing");
    try {
      const result = await importMutation.mutateAsync({
        csvContent,
        skipInvalid,
      });

      toast.success(
        `Importação concluída: ${result.importedCount} músicas importadas`
      );

      if (result.errors.length > 0) {
        toast.warning(
          `${result.skippedCount} linhas ignoradas por erros de validação`
        );
      }

      // Reset
      setCsvContent("");
      setPreview(null);
      setStep("upload");
    } catch (error) {
      toast.error("Erro ao importar CSV");
      console.error(error);
      setStep("preview");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Importar Músicas
          </h1>
          <p className="text-slate-600">
            Faça upload de um arquivo CSV para importar múltiplas músicas
          </p>
        </div>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <Card className="p-8 border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
            <div className="flex flex-col items-center justify-center py-12">
              <Upload className="w-16 h-16 text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Selecione um arquivo CSV
              </h2>
              <p className="text-slate-600 text-center mb-6 max-w-md">
                O arquivo deve conter as colunas: título, artista, gênero e
                duração (MM:SS)
              </p>

              <label className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileUp className="w-4 h-4" />
                    Escolher arquivo
                  </span>
                </Button>
              </label>

              {csvContent && (
                <div className="mt-6 w-full">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Arquivo carregado com sucesso
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handlePreview}
                    disabled={previewMutation.isPending}
                    className="w-full mt-4 bg-slate-900 hover:bg-slate-800"
                  >
                    {previewMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      "Fazer Preview"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Step 2: Preview */}
        {step === "preview" && preview && (
          <div className="space-y-6">
            {/* Summary */}
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Preview da Importação
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-semibold">
                    Total de Linhas
                  </div>
                  <div className="text-3xl font-bold text-blue-900">
                    {preview.totalRows}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-semibold">
                    Válidas
                  </div>
                  <div className="text-3xl font-bold text-green-900">
                    {preview.validRows}
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-semibold">
                    Inválidas
                  </div>
                  <div className="text-3xl font-bold text-red-900">
                    {preview.invalidRows}
                  </div>
                </div>
              </div>

              {/* Errors */}
              {preview.rows.some((r) => !r.isValid) && (
                <Alert className="bg-amber-50 border-amber-200 mb-6">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Algumas linhas contêm erros de validação. Verifique abaixo.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleImport(true)}
                  disabled={importMutation.isPending || preview.validRows === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    `Importar ${preview.validRows} músicas`
                  )}
                </Button>

                <Button
                  onClick={() => setStep("upload")}
                  variant="outline"
                  className="flex-1"
                >
                  Voltar
                </Button>
              </div>
            </Card>

            {/* Detailed Preview Table */}
            <Card className="p-6 bg-white overflow-x-auto">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Detalhes das Linhas
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {preview.rows.map((row) => (
                  <div
                    key={row.rowNumber}
                    className={`p-3 rounded-lg border ${
                      row.isValid
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">
                          Linha {row.rowNumber}
                        </div>
                        {row.isValid && row.data ? (
                          <div className="text-sm text-slate-600 mt-1">
                            <div>
                              <strong>Título:</strong> {row.data.title}
                            </div>
                            <div>
                              <strong>Artista:</strong> {row.data.artist}
                            </div>
                            <div>
                              <strong>Gênero:</strong> {row.data.genre}
                            </div>
                            <div>
                              <strong>Duração:</strong> {row.data.duration}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-red-600 mt-1">
                            {row.errors.map((error, idx) => (
                              <div key={idx}>• {error}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      {row.isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Importing */}
        {step === "importing" && (
          <Card className="p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Importando músicas...
            </h2>
            <p className="text-slate-600">
              Por favor, aguarde enquanto processamos seu arquivo
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
