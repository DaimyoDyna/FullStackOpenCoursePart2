export const PhonebookForm = ({ handleSubmission, handleNameState, handleNumberState }) =>
    <form onSubmit={handleSubmission}>
      <div>
        name: <input onChange={handleNameState} />
      </div>
      <div>
        number: <input onChange={handleNumberState} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>