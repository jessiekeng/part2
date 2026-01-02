const CountryList = ({ countries, onShow }) => (
  <div>
    {countries.map(c => (
      <div key={c.cca3}>
        {c.name.common} 
        <button onClick={() => onShow(c.name.common)}>show</button>
      </div>
    ))}
  </div>
)

export default CountryList