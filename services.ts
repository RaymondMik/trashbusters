/**
 *  Fetch data from REST API via HTTP request.
 * 
 * @param {string} endpoint.
 * @returns {JSON} response from API.
 */
 const fetchData = async({ endpoint, params }: { endpoint: string, params?: any }): Promise<any> => {
   try {
      const response = await fetch(endpoint, params);
      if (!response.ok) throw new Error(response.statusText);
      return response;
   } catch(err) {
      throw new Error(`There was the following problem: ${err} while fetching ${endpoint}`);
   };
};

export { fetchData };