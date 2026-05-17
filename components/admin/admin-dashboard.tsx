"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  id: string;
  name: string;
  headline: string;
  location: string;
  shortBio: string;
  longBio: string;
  avatarUrl: string | null;
  resumeUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  role: string;
  techStack: string[];
  demoUrl: string | null;
  sourceUrl: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  images: ProjectImage[];
};

type ProjectImage = {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  sortOrder: number;
};

type Experience = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  summary: string;
  highlights: string[];
  techStack: string[];
  sortOrder: number;
  published: boolean;
};

type Contact = {
  id: string;
  label: string;
  type: string;
  value: string;
  href: string;
  visible: boolean;
  sortOrder: number;
};

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function boolValue(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function dateValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const profile = useQuery({
    queryKey: ["admin", "profile"],
    queryFn: () => apiRequest<Profile | null>("/api/admin/profile"),
  });
  const projects = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => apiRequest<Project[]>("/api/admin/projects"),
  });
  const experience = useQuery({
    queryKey: ["admin", "experience"],
    queryFn: () => apiRequest<Experience[]>("/api/admin/experience"),
  });
  const contacts = useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: () => apiRequest<Contact[]>("/api/admin/contacts"),
  });

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
              Portfolio Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Content dashboard</h1>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="profile">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfilePanel
              profile={profile.data}
              loading={profile.isLoading}
              onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "profile"] })}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsPanel
              projects={projects.data ?? []}
              loading={projects.isLoading}
              onChanged={() => queryClient.invalidateQueries({ queryKey: ["admin", "projects"] })}
            />
          </TabsContent>

          <TabsContent value="experience">
            <ExperiencePanel
              items={experience.data ?? []}
              loading={experience.isLoading}
              onChanged={() =>
                queryClient.invalidateQueries({ queryKey: ["admin", "experience"] })
              }
            />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsPanel
              contacts={contacts.data ?? []}
              loading={contacts.isLoading}
              onChanged={() => queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] })}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function ProfilePanel({
  profile,
  loading,
  onSaved,
}: {
  profile?: Profile | null;
  loading: boolean;
  onSaved: () => void;
}) {
  const mutation = useMutation({
    mutationFn: (payload: Omit<Profile, "id">) =>
      apiRequest<Profile>("/api/admin/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Profile saved");
      onSaved();
    },
    onError: (error) => toast.error(error.message),
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      name: stringValue(formData.get("name")),
      headline: stringValue(formData.get("headline")),
      location: stringValue(formData.get("location")),
      shortBio: stringValue(formData.get("shortBio")),
      longBio: stringValue(formData.get("longBio")),
      avatarUrl: stringValue(formData.get("avatarUrl")) || null,
      resumeUrl: stringValue(formData.get("resumeUrl")) || null,
      seoTitle: stringValue(formData.get("seoTitle")) || null,
      seoDescription: stringValue(formData.get("seoDescription")) || null,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About and SEO</CardTitle>
        <CardDescription>Controls the public hero, about page, and metadata copy.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        ) : (
          <form className="grid gap-4 lg:grid-cols-2" onSubmit={onSubmit}>
            <Field label="Name">
              <Input name="name" defaultValue={profile?.name ?? ""} required />
            </Field>
            <Field label="Location">
              <Input name="location" defaultValue={profile?.location ?? ""} required />
            </Field>
            <Field label="Headline">
              <Input name="headline" defaultValue={profile?.headline ?? ""} required />
            </Field>
            <Field label="Avatar URL">
              <Input name="avatarUrl" defaultValue={profile?.avatarUrl ?? ""} />
            </Field>
            <Field label="Short bio">
              <Textarea name="shortBio" defaultValue={profile?.shortBio ?? ""} required />
            </Field>
            <Field label="Long bio">
              <Textarea name="longBio" defaultValue={profile?.longBio ?? ""} required />
            </Field>
            <Field label="Resume URL">
              <Input name="resumeUrl" defaultValue={profile?.resumeUrl ?? ""} />
            </Field>
            <Field label="SEO title">
              <Input name="seoTitle" defaultValue={profile?.seoTitle ?? ""} />
            </Field>
            <div className="lg:col-span-2">
              <Field label="SEO description">
                <Textarea
                  name="seoDescription"
                  defaultValue={profile?.seoDescription ?? ""}
                />
              </Field>
            </div>
            <div className="lg:col-span-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save profile"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function ProjectsPanel({
  projects,
  loading,
  onChanged,
}: {
  projects: Project[];
  loading: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: (project: ProjectFormPayload) => {
      const url = project.id ? `/api/admin/projects/${project.id}` : "/api/admin/projects";
      return apiRequest<Project>(url, {
        method: project.id ? "PUT" : "POST",
        body: JSON.stringify(project.payload),
      });
    },
    onSuccess: () => {
      toast.success("Project saved");
      setOpen(false);
      setEditing(null);
      onChanged();
    },
    onError: (error) => toast.error(error.message),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ ok: true }>(`/api/admin/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Project deleted");
      onChanged();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Publish case-study pages and featured work.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="h-4 w-4" />
              New project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
              <DialogDescription>Use external image URLs or upload a new cover.</DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={editing}
              pending={mutation.isPending}
              onSubmit={(payload) => mutation.mutate(payload)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tech</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground">/{project.slug}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {project.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                      {project.featured ? <Badge variant="outline">Featured</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>{project.techStack.join(", ")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(project);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(project.id)}
                        aria-label={`Delete ${project.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

type ProjectFormPayload = {
  id?: string;
  payload: {
    title: string;
    slug: string;
    summary: string;
    body: string;
    role: string;
    techStack: string;
    demoUrl: string | null;
    sourceUrl: string | null;
    featured: boolean;
    published: boolean;
    sortOrder: number;
    images: {
      url: string;
      alt: string;
      caption: string | null;
      sortOrder: number;
    }[];
  };
};

function ProjectForm({
  project,
  pending,
  onSubmit,
}: {
  project: Project | null;
  pending: boolean;
  onSubmit: (payload: ProjectFormPayload) => void;
}) {
  const image = project?.images[0];
  const [imageUrl, setImageUrl] = useState(image?.url ?? "");
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Upload failed");
      }

      const body = (await response.json()) as { url: string };
      setImageUrl(body.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = imageUrl.trim();

    onSubmit({
      id: project?.id,
      payload: {
        title: stringValue(formData.get("title")),
        slug: stringValue(formData.get("slug")),
        summary: stringValue(formData.get("summary")),
        body: stringValue(formData.get("body")),
        role: stringValue(formData.get("role")),
        techStack: stringValue(formData.get("techStack")),
        demoUrl: stringValue(formData.get("demoUrl")) || null,
        sourceUrl: stringValue(formData.get("sourceUrl")) || null,
        featured: boolValue(formData, "featured"),
        published: boolValue(formData, "published"),
        sortOrder: Number(stringValue(formData.get("sortOrder")) || 0),
        images: url
          ? [
              {
                url,
                alt: stringValue(formData.get("imageAlt")) || stringValue(formData.get("title")),
                caption: stringValue(formData.get("imageCaption")) || null,
                sortOrder: 1,
              },
            ]
          : [],
      },
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <Input name="title" defaultValue={project?.title ?? ""} required />
        </Field>
        <Field label="Slug">
          <Input name="slug" defaultValue={project?.slug ?? ""} required />
        </Field>
        <Field label="Role">
          <Input name="role" defaultValue={project?.role ?? ""} required />
        </Field>
        <Field label="Sort order">
          <Input name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 0} />
        </Field>
      </div>
      <Field label="Summary">
        <Textarea name="summary" defaultValue={project?.summary ?? ""} required />
      </Field>
      <Field label="Detail body">
        <Textarea name="body" defaultValue={project?.body ?? ""} required />
      </Field>
      <Field label="Tech stack, comma-separated">
        <Input name="techStack" defaultValue={project?.techStack.join(", ") ?? ""} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Demo URL">
          <Input name="demoUrl" defaultValue={project?.demoUrl ?? ""} />
        </Field>
        <Field label="Source URL">
          <Input name="sourceUrl" defaultValue={project?.sourceUrl ?? ""} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <Field label="Cover image URL">
          <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
        </Field>
        <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium hover:bg-secondary">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadImage(file);
            }}
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Image alt">
          <Input name="imageAlt" defaultValue={image?.alt ?? ""} />
        </Field>
        <Field label="Image caption">
          <Input name="imageCaption" defaultValue={image?.caption ?? ""} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="featured" defaultChecked={project?.featured ?? false} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="published" defaultChecked={project?.published ?? true} />
          Published
        </label>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={pending || uploading}>
          {pending ? "Saving..." : "Save project"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ExperiencePanel({
  items,
  loading,
  onChanged,
}: {
  items: Experience[];
  loading: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<Experience | null>(null);
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: (payload: ExperienceFormPayload) => {
      const url = payload.id ? `/api/admin/experience/${payload.id}` : "/api/admin/experience";
      return apiRequest<Experience>(url, {
        method: payload.id ? "PUT" : "POST",
        body: JSON.stringify(payload.payload),
      });
    },
    onSuccess: () => {
      toast.success("Experience saved");
      setOpen(false);
      setEditing(null);
      onChanged();
    },
    onError: (error) => toast.error(error.message),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ ok: true }>(`/api/admin/experience/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Experience deleted");
      onChanged();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Experience</CardTitle>
          <CardDescription>Manage timeline items and role highlights.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="h-4 w-4" />
              New role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit experience" : "New experience"}</DialogTitle>
              <DialogDescription>
                Add a role, timeline dates, highlights, and technical context.
              </DialogDescription>
            </DialogHeader>
            <ExperienceForm
              item={editing}
              pending={mutation.isPending}
              onSubmit={(payload) => mutation.mutate(payload)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading experience...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.published ? "Published" : "Draft"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(item);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(item.id)}
                        aria-label={`Delete ${item.role}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

type ExperienceFormPayload = {
  id?: string;
  payload: {
    company: string;
    role: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    current: boolean;
    summary: string;
    highlights: string;
    techStack: string;
    sortOrder: number;
    published: boolean;
  };
};

function ExperienceForm({
  item,
  pending,
  onSubmit,
}: {
  item: Experience | null;
  pending: boolean;
  onSubmit: (payload: ExperienceFormPayload) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      id: item?.id,
      payload: {
        company: stringValue(formData.get("company")),
        role: stringValue(formData.get("role")),
        location: stringValue(formData.get("location")) || null,
        startDate: stringValue(formData.get("startDate")),
        endDate: stringValue(formData.get("endDate")) || null,
        current: boolValue(formData, "current"),
        summary: stringValue(formData.get("summary")),
        highlights: stringValue(formData.get("highlights")),
        techStack: stringValue(formData.get("techStack")),
        sortOrder: Number(stringValue(formData.get("sortOrder")) || 0),
        published: boolValue(formData, "published"),
      },
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company">
          <Input name="company" defaultValue={item?.company ?? ""} required />
        </Field>
        <Field label="Role">
          <Input name="role" defaultValue={item?.role ?? ""} required />
        </Field>
        <Field label="Location">
          <Input name="location" defaultValue={item?.location ?? ""} />
        </Field>
        <Field label="Sort order">
          <Input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
        </Field>
        <Field label="Start date">
          <Input name="startDate" type="date" defaultValue={dateValue(item?.startDate ?? null)} required />
        </Field>
        <Field label="End date">
          <Input name="endDate" type="date" defaultValue={dateValue(item?.endDate ?? null)} />
        </Field>
      </div>
      <Field label="Summary">
        <Textarea name="summary" defaultValue={item?.summary ?? ""} required />
      </Field>
      <Field label="Highlights, one per line">
        <Textarea name="highlights" defaultValue={item?.highlights.join("\n") ?? ""} />
      </Field>
      <Field label="Tech stack, comma-separated">
        <Input name="techStack" defaultValue={item?.techStack.join(", ") ?? ""} />
      </Field>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch name="current" defaultChecked={item?.current ?? false} />
          Current role
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox name="published" defaultChecked={item?.published ?? true} />
          Published
        </label>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save experience"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ContactsPanel({
  contacts,
  loading,
  onChanged,
}: {
  contacts: Contact[];
  loading: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<Contact | null>(null);
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: (payload: ContactFormPayload) => {
      const url = payload.id ? `/api/admin/contacts/${payload.id}` : "/api/admin/contacts";
      return apiRequest<Contact>(url, {
        method: payload.id ? "PUT" : "POST",
        body: JSON.stringify(payload.payload),
      });
    },
    onSuccess: () => {
      toast.success("Contact saved");
      setOpen(false);
      setEditing(null);
      onChanged();
    },
    onError: (error) => toast.error(error.message),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ ok: true }>(`/api/admin/contacts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Contact deleted");
      onChanged();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Contacts</CardTitle>
          <CardDescription>Manage links shown in the contact sections.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="h-4 w-4" />
              New contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit contact" : "New contact"}</DialogTitle>
              <DialogDescription>
                Add a visible contact link for LinkedIn, GitHub, Email, or another channel.
              </DialogDescription>
            </DialogHeader>
            <ContactForm
              contact={editing}
              pending={mutation.isPending}
              onSubmit={(payload) => mutation.mutate(payload)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading contacts...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.label}</TableCell>
                  <TableCell>{contact.value}</TableCell>
                  <TableCell>{contact.visible ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(contact);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(contact.id)}
                        aria-label={`Delete ${contact.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

type ContactFormPayload = {
  id?: string;
  payload: {
    label: string;
    type: string;
    value: string;
    href: string;
    visible: boolean;
    sortOrder: number;
  };
};

function ContactForm({
  contact,
  pending,
  onSubmit,
}: {
  contact: Contact | null;
  pending: boolean;
  onSubmit: (payload: ContactFormPayload) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      id: contact?.id,
      payload: {
        label: stringValue(formData.get("label")),
        type: stringValue(formData.get("type")),
        value: stringValue(formData.get("value")),
        href: stringValue(formData.get("href")),
        visible: boolValue(formData, "visible"),
        sortOrder: Number(stringValue(formData.get("sortOrder")) || 0),
      },
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Label">
          <Input name="label" defaultValue={contact?.label ?? ""} required />
        </Field>
        <Field label="Type">
          <Input name="type" defaultValue={contact?.type ?? ""} required />
        </Field>
        <Field label="Value">
          <Input name="value" defaultValue={contact?.value ?? ""} required />
        </Field>
        <Field label="Sort order">
          <Input name="sortOrder" type="number" defaultValue={contact?.sortOrder ?? 0} />
        </Field>
      </div>
      <Field label="Href">
        <Input name="href" defaultValue={contact?.href ?? ""} required />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox name="visible" defaultChecked={contact?.visible ?? true} />
        Visible
      </label>
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save contact"}
        </Button>
      </DialogFooter>
    </form>
  );
}
