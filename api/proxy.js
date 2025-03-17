module.exports = async (req, res) => {
  try {
    const response = await fetch(
      "http://nexifytw.mynetgear.com:45000/api/Record/GetRecords"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
