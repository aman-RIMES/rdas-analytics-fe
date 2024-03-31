type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg
      {...props}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 4v15c0 .6.4 1 1 1h15M8 16l2.5-5.5 3 3L17.3 7 20 9.7"
      />
    </svg>
  ),
  notification: () => (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 5.4V3m0 2.4a5.3 5.3 0 0 1 5.1 5.3v1.8c0 2.4 1.9 3 1.9 4.2 0 .6 0 1.2-.5 1.2h-13c-.5 0-.5-.6-.5-1.2 0-1.2 1.9-1.8 1.9-4.2v-1.8A5.3 5.3 0 0 1 12 5.4Zm-8.1 5.3c0-2 .8-4.1 2.2-5.7m14 5.7c0-2-.8-4.1-2.2-5.7M8.5 18a3.5 3.5 0 0 0 7 0h-7Z"
      />
    </svg>
  ),
  google: (props: IconProps) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
  rainfall: () => (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      strokeWidth={0.3}
      stroke="currentColor"
      className="w-7 h-7"
    >
      <path d="M4.158 12.025a.5.5 0 01.316.633l-.5 1.5a.5.5 0 01-.948-.316l.5-1.5a.5.5 0 01.632-.317zm3 0a.5.5 0 01.316.633l-1 3a.5.5 0 01-.948-.316l1-3a.5.5 0 01.632-.317zm3 0a.5.5 0 01.316.633l-.5 1.5a.5.5 0 01-.948-.316l.5-1.5a.5.5 0 01.632-.317zm3 0a.5.5 0 01.316.633l-1 3a.5.5 0 11-.948-.316l1-3a.5.5 0 01.632-.317zm.247-6.998a5.001 5.001 0 00-9.499-1.004A3.5 3.5 0 103.5 11H13a3 3 0 00.405-5.973zM8.5 2a4 4 0 013.976 3.555.5.5 0 00.5.445H13a2 2 0 010 4H3.5a2.5 2.5 0 11.605-4.926.5.5 0 00.596-.329A4.002 4.002 0 018.5 2z" />
    </svg>
  ),
  temperature: () => (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      strokeWidth={0.3}
      stroke="currentColor"
      className="w-7 h-7"
    >
      <path d="M9.5 12.5a1.5 1.5 0 11-2-1.415V6.5a.5.5 0 011 0v4.585a1.5 1.5 0 011 1.415z" />
      <path d="M5.5 2.5a2.5 2.5 0 015 0v7.55a3.5 3.5 0 11-5 0V2.5zM8 1a1.5 1.5 0 00-1.5 1.5v7.987l-.167.15a2.5 2.5 0 103.333 0l-.166-.15V2.5A1.5 1.5 0 008 1z" />
    </svg>
  ),
  extremes: () => (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      strokeWidth={0.3}
      stroke="currentColor"
      className="w-7 h-7"
    >
      <path d="M11.251.068a.5.5 0 01.227.58L9.677 6.5H13a.5.5 0 01.364.843l-8 8.5a.5.5 0 01-.842-.49L6.323 9.5H3a.5.5 0 01-.364-.843l8-8.5a.5.5 0 01.615-.09zM4.157 8.5H7a.5.5 0 01.478.647L6.11 13.59l5.732-6.09H9a.5.5 0 01-.478-.647L9.89 2.41 4.157 8.5z" />
    </svg>
  ),
};
