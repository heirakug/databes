import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createData } from "~/models/data.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const deviceType = formData.get("deviceType");
  const deviceName = formData.get("deviceName");
  const data = formData.get("data");

  if (typeof deviceType !== "string" || deviceType.length === 0) {
    return json(
      { errors: { body: null, title: "Device Type is required" } },
      { status: 400 },
    );
  }

  if (typeof deviceName !== "string" || deviceName.length === 0) {
    return json(
      { errors: { body: "Device Name is required", title: null } },
      { status: 400 },
    );
  }

    if (typeof data !== "string" || data.length === 0) {
      return json(
        { errors: { body: "Data is required", title: null } },
        { status: 400 },
      );
  }

  const newdata = await createData({ deviceType , deviceName, data, userId });

  return redirect(`/datas/${newdata.id}`);
};

export default function NewDataPage() {
  const actionData = useActionData<typeof action>();
  const devicetypeRef = useRef<HTMLInputElement>(null);
  const devicenameRef = useRef<HTMLTextAreaElement>(null);
  const dataRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.devicetype) {
      devicetypeRef.current?.focus();
    } else if (actionData?.errors?.devicenama) {
      devicenameRef.current?.focus();
    } else if (actionData?.errors?.data) {
      dataRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Device Type: </span>
          <input
            ref={devicetypeRef}
            name="deviceType"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.devicetype ? true : undefined}
            aria-errormessage={
              actionData?.errors?.devicetype ? "devicetype-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.devicetype ? (
          <div className="pt-1 text-red-700" id="devicetype-error">
            {actionData.errors.devicetype}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Device Name: </span>
          <input
            ref={devicenameRef}
            name="deviceName"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.devicename ? true : undefined}
            aria-errormessage={
              actionData?.errors?.devicename ? "devicename-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.devicename ? (
          <div className="pt-1 text-red-700" id="devicename-error">
            {actionData.errors.devicename}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Data: </span>
          <input
            ref={dataRef}
            name="data"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.data ? true : undefined}
            aria-errormessage={
              actionData?.errors?.data ? "data-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.data ? (
          <div className="pt-1 text-red-700" id="data-error">
            {actionData.errors.data}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
