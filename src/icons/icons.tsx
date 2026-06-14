import { createIcon } from "./createIcon";

/** "X" close icon, used by dismissible Modals, Drawers, and Toasts. */
export const CloseIcon = createIcon(
  "CloseIcon",
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>,
);

/** Checkmark icon, used for success states and selected items. */
export const CheckIcon = createIcon("CheckIcon", <path d="M20 6 9 17l-5-5" />);

/** Circle with a checkmark, used for success Alerts and Toasts. */
export const CheckCircleIcon = createIcon(
  "CheckCircleIcon",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </>,
);

/** Circle with an "i", used for informational Alerts and Toasts. */
export const InfoIcon = createIcon(
  "InfoIcon",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </>,
);

/** Filled triangle with "!" mark, used for warning Alerts and Toasts. */
export const AlertTriangleIcon = createIcon(
  "AlertTriangleIcon",
  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01" />,
);

/** Filled circle with "!" mark, used for error/destructive Alerts and Toasts. */
export const AlertCircleIcon = createIcon(
  "AlertCircleIcon",
  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 8v4M12 16h.01" />,
);

/** Chevron pointing down, used for Select/Accordion expand affordances. */
export const ChevronDownIcon = createIcon("ChevronDownIcon", <path d="m6 9 6 6 6-6" />);

/** Magnifying glass icon, used for search Inputs. */
export const SearchIcon = createIcon(
  "SearchIcon",
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-3.5-3.5" />
  </>,
);

/** Envelope icon, used for email Inputs. */
export const MailIcon = createIcon(
  "MailIcon",
  <>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </>,
);

/** Filled five-point star, used for ratings and favorite toggles. */
export const StarIcon = createIcon(
  "StarIcon",
  <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2Z" />,
  true,
);

/** Animated spinner icon, used for loading states. */
export const SpinnerIcon = createIcon(
  "SpinnerIcon",
  <>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} fill="none" />
    <path
      className="opacity-75"
      fill="currentColor"
      stroke="none"
      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"
    />
  </>,
);
