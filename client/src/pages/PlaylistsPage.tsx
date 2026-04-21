import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus, Music, Clock, Trash2, GripVertical, Edit2 } from "lucide-react";

export default function PlaylistsPage() {
  const { user } = useAuth();
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rehearsalId: 1,
    ministryId: 1,
    duration: undefined as number | undefined,
  });
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    duration: 0,
    key: "",
    tempo: 0,
    lyrics: "",
    musicUrl: "",
    cifraUrl: "",
    notes: "",
  });

  const churchId = user?.churchId || 1;

  // Queries
  const { data: playlists = [], isLoading: loadingPlaylists } = trpc.playlists.list.useQuery({
    rehearsalId: formData.rehearsalId,
  });

  const { data: selectedPlaylistData } = trpc.playlists.getById.useQuery(
    { id: selectedPlaylist || 0 },
    { enabled: !!selectedPlaylist }
  );

  const { data: songs = [] } = trpc.playlists.getSongs.useQuery(
    { playlistId: selectedPlaylist || 0 },
    { enabled: !!selectedPlaylist }
  );

  const { data: totalDuration = 0 } = trpc.playlists.getTotalDuration.useQuery(
    { playlistId: selectedPlaylist || 0 },
    { enabled: !!selectedPlaylist }
  );

  // Mutations
  const createMutation = trpc.playlists.create.useMutation({
    onSuccess: () => {
      setFormData({
        name: "",
        description: "",
        rehearsalId: 1,
        ministryId: 1,
        duration: undefined,
      });
      setIsCreateOpen(false);
    },
  });

  const addSongMutation = trpc.playlists.addSong.useMutation({
    onSuccess: () => {
      setSongData({
        title: "",
        artist: "",
        duration: 0,
        key: "",
        tempo: 0,
        lyrics: "",
        musicUrl: "",
        cifraUrl: "",
        notes: "",
      });
      setIsAddSongOpen(false);
    },
  });

  const deleteMutation = trpc.playlists.delete.useMutation();
  const removeSongMutation = trpc.playlists.removeSong.useMutation();

  const handleCreatePlaylist = async () => {
    if (!formData.name) return;

    await createMutation.mutateAsync({
      name: formData.name,
      description: formData.description,
      rehearsalId: formData.rehearsalId,
      ministryId: formData.ministryId,
      churchId,
      duration: formData.duration,
    });
  };

  const handleAddSong = async () => {
    if (!formData.name || !songData.title) return;

    await addSongMutation.mutateAsync({
      playlistId: selectedPlaylist || 0,
      title: songData.title,
      artist: songData.artist,
      duration: songData.duration,
      key: songData.key,
      tempo: songData.tempo,
      lyrics: songData.lyrics,
      musicUrl: songData.musicUrl,
      cifraUrl: songData.cifraUrl,
      notes: songData.notes,
    });
  };

  const handleDeletePlaylist = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta playlist?")) {
      await deleteMutation.mutateAsync({ id });
      setSelectedPlaylist(null);
    }
  };

  const handleRemoveSong = async (id: number) => {
    if (confirm("Tem certeza que deseja remover esta música?")) {
      await removeSongMutation.mutateAsync({ id });
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Playlists</h1>
          <p className="text-gray-600">Organize e gerencie as playlists de músicas para os ensaios</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Playlists List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Playlists</CardTitle>
                  <CardDescription>{playlists.length} playlists</CardDescription>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Nova
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Playlist</DialogTitle>
                      <DialogDescription>Crie uma nova playlist para organizar músicas</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          placeholder="Ex: Missa Dominical"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          placeholder="Descreva a playlist..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <Button onClick={handleCreatePlaylist} disabled={createMutation.isPending} className="w-full">
                        {createMutation.isPending ? "Criando..." : "Criar Playlist"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent className="space-y-2">
                {loadingPlaylists ? (
                  <div className="text-center py-8 text-gray-500">Carregando...</div>
                ) : playlists.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nenhuma playlist criada</div>
                ) : (
                  <div className="space-y-2">
                    {playlists.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => setSelectedPlaylist(playlist.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                          selectedPlaylist === playlist.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{playlist.name}</p>
                            <p className="text-sm text-gray-500">{playlist.totalSongs || 0} músicas</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Playlist Details */}
          <div className="lg:col-span-2">
            {selectedPlaylist && selectedPlaylistData ? (
              <div className="space-y-6">
                {/* Playlist Info */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        {selectedPlaylistData.name}
                      </CardTitle>
                      <CardDescription>{selectedPlaylistData.description}</CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePlaylist(selectedPlaylist)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                        <Music className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-600">Músicas</p>
                          <p className="font-bold text-gray-900">{songs.length}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-600">Duração</p>
                          <p className="font-bold text-gray-900">{formatDuration(totalDuration)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                        <div className="w-4 h-4 rounded-full bg-gray-600" />
                        <div>
                          <p className="text-xs text-gray-600">Status</p>
                          <p className="font-bold text-gray-900">Ativa</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Song */}
                <Dialog open={isAddSongOpen} onOpenChange={setIsAddSongOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2">
                      <Plus className="w-4 h-4" />
                      Adicionar Música
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Adicionar Música</DialogTitle>
                      <DialogDescription>Adicione uma nova música à playlist</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          placeholder="Título da música"
                          value={songData.title}
                          onChange={(e) => setSongData({ ...songData, title: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="artist">Artista</Label>
                        <Input
                          id="artist"
                          placeholder="Artista"
                          value={songData.artist}
                          onChange={(e) => setSongData({ ...songData, artist: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="duration">Duração (seg)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={songData.duration}
                            onChange={(e) => setSongData({ ...songData, duration: parseInt(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="key">Tom</Label>
                          <Input
                            id="key"
                            placeholder="Ex: C, D, E"
                            value={songData.key}
                            onChange={(e) => setSongData({ ...songData, key: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tempo">Tempo (BPM)</Label>
                        <Input
                          id="tempo"
                          type="number"
                          value={songData.tempo}
                          onChange={(e) => setSongData({ ...songData, tempo: parseInt(e.target.value) })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="musicUrl">URL da Música</Label>
                        <Input
                          id="musicUrl"
                          placeholder="Link para YouTube, Spotify, etc"
                          value={songData.musicUrl}
                          onChange={(e) => setSongData({ ...songData, musicUrl: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cifraUrl">URL da Cifra</Label>
                        <Input
                          id="cifraUrl"
                          placeholder="Link para a cifra"
                          value={songData.cifraUrl}
                          onChange={(e) => setSongData({ ...songData, cifraUrl: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="lyrics">Letra</Label>
                        <Textarea
                          id="lyrics"
                          placeholder="Letra da música"
                          value={songData.lyrics}
                          onChange={(e) => setSongData({ ...songData, lyrics: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes">Notas do Maestro</Label>
                        <Textarea
                          id="notes"
                          placeholder="Observações importantes"
                          value={songData.notes}
                          onChange={(e) => setSongData({ ...songData, notes: e.target.value })}
                        />
                      </div>

                      <Button onClick={handleAddSong} disabled={addSongMutation.isPending} className="w-full">
                        {addSongMutation.isPending ? "Adicionando..." : "Adicionar Música"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Songs List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Músicas ({songs.length})</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {songs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Nenhuma música adicionada</div>
                    ) : (
                      <div className="space-y-2">
                        {songs.map((song, index) => (
                          <div
                            key={song.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{index + 1}. {song.title}</p>
                                <p className="text-sm text-gray-600">
                                  {song.artist} {song.key && `• Tom: ${song.key}`} {song.tempo && `• ${song.tempo} BPM`}
                                </p>
                              </div>
                              {song.duration && (
                                <span className="text-sm text-gray-500">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, "0")}</span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSong(song.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <p className="text-gray-500">Selecione uma playlist para ver os detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
