const STYLES = {
  info: "color: #2196F3; font-weight: bold; background: #e3f2fd; padding: 2px 5px; border-radius: 3px;",
  success:
    "color: #4CAF50; font-weight: bold; background: #e8f5e9; padding: 2px 5px; border-radius: 3px;",
  error:
    "color: #F44336; font-weight: bold; background: #ffebee; padding: 2px 5px; border-radius: 3px;",
  warning:
    "color: #FF9800; font-weight: bold; background: #fff3e0; padding: 2px 5px; border-radius: 3px;",
  table: "color: #9C27B0; font-weight: bold;",
};

const isDev = import.meta.env.DEV;

class Logger {
  info(message: string, ...data: any[]) {
    if (!isDev) return;
    console.log(`%c[INFO] ${message}`, STYLES.info, ...data);
  }

  success(message: string, ...data: any[]) {
    if (!isDev) return;
    console.log(`%c[INFO] ${message}`, STYLES.success, ...data);
  }

  error(message: string, error: any[]) {
    if (!isDev) return;
    console.group(`%c[ERROR] ${message}`, STYLES.error);
    console.error(error);
    console.groupEnd();
  }

  warning(message: string, ...data: any[]) {
    if (!isDev) return;
    console.warn(`%c[WARNING] ${message}`, STYLES.warning, ...data);
  }

  table(title: string, data: any[]) {
    if (!isDev) return;
    console.log(`%c[TABLE] ${title}`, STYLES.table);
    console.table(data);
  }
}

export default new Logger();
