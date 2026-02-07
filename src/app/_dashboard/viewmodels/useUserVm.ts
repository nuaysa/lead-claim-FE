"use client";

import { useState, useCallback, useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";
import { getSalesParams, inputUserParams } from "@/api/types/types";
import { Sales } from "@/types/Lead";
import { deleteUser, editUser, register } from "@/api/auth";
import { getSalesClaims } from "@/api/leads";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
  const baseUserSchema = {
    name: yup.string().trim(),
    role: yup.string(),
    email: yup.string().email("Email tidak valid"),
    password: yup.string(),
  };

  const createUserSchema = yup.object({
    name: baseUserSchema.name.required("* Nama wajib diisi"),
    role: baseUserSchema.role.required("* Role wajib diisi"),
    email: baseUserSchema.email.required("* Email wajib diisi"),
    password: baseUserSchema.password.required("* Password wajib diisi"),
  });

  const editUserSchema = yup.object({
    name: baseUserSchema.name.optional(),
    role: baseUserSchema.role.optional(),
    email: baseUserSchema.email.optional(),
    password: baseUserSchema.password.optional(),
  });

  type CreateUserFormValue = yup.InferType<typeof createUserSchema>;
  type EditUserFormValue = yup.InferType<typeof editUserSchema>;
  export type UserFormValue = CreateUserFormValue | EditUserFormValue;

export const useUserVM = () => {
  const [User, setUser] = useState<Sales[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<Sales | null>(null);
  const [salesParams, setSalesParams] = useState<getSalesParams>({});

  const [salesPage, setSalesPage] = useState(1);
    const [salesTotalPages, setSalesTotalPages] = useState(1);

  const [salesStats, setSalesStats] = useState<Sales[]>([]);
  const { showToast } = useToast();

  const UserForm = useForm<UserFormValue>({
    resolver: yupResolver(mode === "create" ? createUserSchema : editUserSchema) as any,
    defaultValues: {
      name: "",
      role: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const fetchSalesClaim = useCallback(
    async (params?: getSalesParams) => {
      try {
        setIsLoading(true);

        const res = await getSalesClaims(params ?? salesParams);

        const items = res.data ?? [];

        setSalesStats(items);
        setSalesPage(res.pagination.page ??1);
        setSalesTotalPages(res.pagination.totalPages ?? 1);

      } catch (error: any) {
        showToast(error.message, "ERROR");
      } finally {
        setIsLoading(false);
      }
    },
    [salesParams, showToast],
  );

  const applySalesDateRange = (start?: string, end?: string) => {
    const params: getSalesParams = {};

    if (start) params.start = start;
    if (end) params.end = end;

    setSalesParams(params);
  };

  const fetchData = useCallback(async () => {
    await fetchSalesClaim();
  }, [fetchSalesClaim]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handleOpenCreateModal = useCallback(() => {
    setMode("create");
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((item: Sales) => {
    setMode("edit");
    setSelectedItem(item);
    setIsCreateModalOpen(true);
  }, []);

  const onSubmit: SubmitHandler<inputUserParams> = useCallback(
    async (data) => {
      setIsLoading(true);

      try {
      const payload =
      mode === "edit"
        ? Object.fromEntries(
            Object.entries(data).filter(
              ([_, v]) => v !== "" && v !== undefined
            )
          )
        : data;


        if (mode === "create") {
          const newUser = {
            ...payload,
          };
          const res = await register(newUser);
          showToast(res.message ?? "user berhasil ditambahkan!", "SUCCESS");
        } else {
          const res = await editUser({ id: selectedItem!.id!.toString(), data: payload });
          showToast(res.message ?? "user berhasil diperbarui!", "SUCCESS");
        }

        setIsCreateModalOpen(false);
        UserForm.reset();

        await refreshData();
      } catch (error: any) {
        showToast(error.message || "Terjadi kesalahan", "ERROR");
      } finally {
        setIsLoading(false);
      }
    },
    [mode, selectedItem, UserForm, showToast, refreshData],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const res = await deleteUser(id);

        showToast(res.message ?? "User berhasil dihapus", "SUCCESS");
        setUser((prev) => prev.filter((cat) => cat.id !== Number(id)));

        await refreshData();
      } catch (error: any) {
        showToast(error.message || "Terjadi kesalahan saat menghapus", "ERROR");
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
      }
    },
    [showToast, refreshData],
  );

  return {
    User,
    isLoading,
    isCreateModalOpen,
    isModalOpen,
    mode,
    selectedItem,
    UserForm,

    setMode,
    setSelectedItem,
    setIsLoading,
    setIsCreateModalOpen,
    setIsModalOpen,

    handleOpenCreateModal,
    handleOpenEditModal,
    handleDelete,
    onSubmit,
    refreshData,
    fetchSalesClaim,
    applySalesDateRange,
    salesStats,
    salesPage,
    setSalesPage,salesTotalPages, setSalesTotalPages
  };
};
