/**
 * 创建防抖函数 选项
 */
interface IOptions {
  /**
   * 立即执行
   *
   * default = false
   */
  immediate?: boolean;
  /**
   * 创建执行 - 创建时
   *
   * default = false
   */
  creating?: boolean;
  /**
   * 创建执行参数
   */
  creatingParams?: any[];
  /**
   * 间隔
   *
   * default = 1000
   */
  interval?: number;
}

/**
 * 创建防抖函数
 * @param callback 执行函数
 * @param options `{immediate: 立即执行; interval: 间隔;}` | 间隔
 * @returns 执行函数
 */
export function createDebounceInterval<T extends (...args: any[]) => void>(
  callback: T,
  options: IOptions | number = 1000
): T {
  /**
   * 立即执行
   */
  const immediate = typeof options === 'number' ? false : options.immediate || false;
  /**
   * 创建时执行
   */
  const creating = typeof options === 'number' ? false : options.creating || false;
  /**
   * 间隔
   */
  const interval = typeof options === 'number' ? options : options.interval || 1000;
  /**
   * 句柄
   */
  let timeout: number | null = null;

  // 创建执行
  if (creating) callback(...((options as any)?.creatingParams || []));

  /**
   * 防抖函数
   */
  const debounced = (...args: any[]) => {
    // 清除延时器
    if (timeout) clearTimeout(timeout);

    /* 立即执行 */
    if (immediate) {
      timeout = setTimeout(() => {
        timeout = null;
      }, interval) as unknown as number;

      if (!timeout) callback(...args);
      return;
    }

    /* 延时执行 */
    timeout = setTimeout(() => callback(...args), interval) as unknown as number;
  };

  return debounced as T;
}

export default createDebounceInterval;

/* jest start */

// const fc = createDebounceInterval((i: any) => console.log(i))

// fc('start')

// setTimeout(() => {
//   fc('400')

//   setTimeout(() => {
//     fc('500')

//     setTimeout(() => fc('1500'), 1500)
//   }, 500)
// }, 400)

/* jest end */
