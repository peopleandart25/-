import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useAgency } from "../context/AgencyContext";
import { INQUIRY_TYPE_KEYS, type InquiryTypeKey } from "../types";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

interface FormValues {
  name: string;
  company: string;
  phone: string;
  type: string;
  message: string;
  consent: boolean;
}

const initialValues: FormValues = {
  name: "",
  company: "",
  phone: "",
  type: "",
  message: "",
  consent: false,
};

const fieldClass =
  "w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-base text-white outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-orange md:text-lg";

export function ContactSection() {
  const { t } = useTranslation();
  const { addInquiry } = useAgency();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [alert, setAlert] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const hasRequired = (form: FormValues) =>
    Boolean(
      form.name.trim() &&
        form.phone.trim() &&
        form.type &&
        form.message.trim(),
    );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasRequired(values)) {
      setAlert(t("contact.missing"));
      setStatus("error");
      return;
    }
    if (!values.consent) {
      setAlert(t("contact.errConsent"));
      setStatus("error");
      return;
    }

    const type = values.type as InquiryTypeKey;
    const saved = addInquiry({
      name: values.name,
      company: values.company,
      phone: values.phone,
      type,
      typeLabel: t(`contact.types.${type}`),
      message: values.message,
    });

    if (!saved) {
      setAlert(t("contact.missing"));
      setStatus("error");
      return;
    }

    setAlert("");
    setStatus("success");
  };

  const reset = () => {
    setValues(initialValues);
    setAlert("");
    setStatus("idle");
  };

  return (
    <section id="contact" className="flex min-h-full items-center py-16 md:py-28">
      <div className="editorial-grid grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionLabel index="06" label={t("contact.kicker")} />
          <h2 className="font-display text-4xl font-semibold leading-[1.08] text-white md:text-7xl md:leading-[1.05]">
            {t("contact.headline1")}
            <br />
            {t("contact.headline2")}
            <br />
            <span className="text-orange">{t("contact.headline3")}</span>
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/55 md:mt-6 md:text-lg">
            {t("contact.intro")}
          </p>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4 }}
                className="border-t border-orange pt-8"
                role="status"
                aria-live="polite"
              >
                <p className="font-mono text-base tracking-[0.22em] text-orange">
                  {t("contact.successKicker")}
                </p>
                <p className="mt-4 font-display text-3xl text-white md:text-5xl">
                  {t("contact.successTitle")}
                </p>
                <p className="mt-4 max-w-md text-base text-white/55 md:text-lg">
                  {t("contact.successBody")}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 inline-flex min-h-11 items-center border-b border-white py-2 font-mono text-sm tracking-[0.2em] text-white transition-colors duration-300 hover:border-orange hover:text-orange md:text-base"
                >
                  {t("contact.again")}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate
                className="grid grid-cols-1 gap-8 md:grid-cols-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Field
                  id="name"
                  label={t("contact.name")}
                  value={values.name}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, name: value }))
                  }
                  autoComplete="name"
                  required
                />
                <Field
                  id="company"
                  label={t("contact.company")}
                  value={values.company}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, company: value }))
                  }
                  autoComplete="organization"
                />
                <Field
                  id="phone"
                  label={t("contact.phone")}
                  type="tel"
                  value={values.phone}
                  onChange={(value) =>
                    setValues((prev) => ({ ...prev, phone: value }))
                  }
                  autoComplete="tel"
                  required
                />
                <div>
                  <label
                    htmlFor="type"
                    className="font-mono text-base tracking-[0.2em] text-white/45"
                  >
                    {t("contact.type")}
                    <span className="ml-1 text-orange" aria-hidden>
                      *
                    </span>
                  </label>
                  <select
                    id="type"
                    value={values.type}
                    required
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, type: event.target.value }))
                    }
                    className={`${fieldClass} appearance-none rounded-none`}
                  >
                    <option value="" className="bg-charcoal">
                      {t("contact.typePlaceholder")}
                    </option>
                    {INQUIRY_TYPE_KEYS.map((type) => (
                      <option key={type} value={type} className="bg-charcoal">
                        {t(`contact.types.${type}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="message"
                    className="font-mono text-base tracking-[0.2em] text-white/45"
                  >
                    {t("contact.message")}
                    <span className="ml-1 text-orange" aria-hidden>
                      *
                    </span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={values.message}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        message: event.target.value,
                      }))
                    }
                    className={`${fieldClass} resize-none`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 p-1 text-base text-white md:text-lg">
                    <input
                      type="checkbox"
                      checked={values.consent}
                      onChange={(event) =>
                        setValues((prev) => ({
                          ...prev,
                          consent: event.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 accent-orange"
                    />
                    <span>{t("contact.consent")}</span>
                  </label>
                </div>
                {alert ? (
                  <p className="text-base text-orange md:col-span-2" role="alert">
                    {alert}
                  </p>
                ) : null}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 bg-orange px-6 py-3.5 font-mono text-base tracking-[0.22em] text-charcoal transition-colors duration-300 hover:bg-orange-deep md:px-8 md:py-3 md:text-xl"
                  >
                    {t("contact.send")}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-mono text-base tracking-[0.2em] text-white/45"
      >
        {label}
        {required ? (
          <span className="ml-1 text-orange" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </div>
  );
}
