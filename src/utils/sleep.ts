const sleep = (timeout: number) => {
  return timeout > 0
    ? new Promise((resolve) => {
        setTimeout(resolve, timeout, timeout);
      })
    : Promise.resolve(timeout);
};

export default sleep;
