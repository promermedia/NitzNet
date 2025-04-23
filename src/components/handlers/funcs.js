import Tools from "./tools";

const Funcs = {
  addDonation: async (formdata) => {
    try {
      var requestOptions = {
        method: "POST",
        body: formdata,
      };
      const response = await fetch(
        Tools.serverURL + "donations/addDonation",
        requestOptions
      );
      const result = await response.json();
      if (result && result.payload && result.payload.success === true) {
        return result.payload.donation;
      } else {
        throw new Error(result);
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
export default Funcs;
