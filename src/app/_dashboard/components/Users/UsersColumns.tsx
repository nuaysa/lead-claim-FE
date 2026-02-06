
import { Field } from "@/components/Common/Form/Form";
import { UserFormValue } from "../../viewmodels/useUserVm";

const fields: Field<UserFormValue>[] = [
  {
    name: "name",
    label: "Nama user",
    type: "text",
    placeholder: "Masukkan nama user",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    placeholder: "Pilih role user",
    options: [
      {
        value: "ADMIN",
        label: "Admin",
      },
      {
        value: "SALES",
        label: "Sales",
      },
    ],
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Masukkan email user",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Masukkan password user",
  },
];

export default fields;