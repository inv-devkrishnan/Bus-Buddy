function PasswordRequirements()
{
    return(
        <div className="d-flex justify-content-center">
              <ul>
                <li>8 ~ 20 characters</li>
                <li>Atleast one Capital-case letter in English (A B C … Z) </li>
                <li>Atleast one Lower-case letter in English (a b c … z)</li>
                <li>Atleast one Number (0 1 2 … 9)</li>
                <li>Atleast one Special characters (! @ # ...)</li>
              </ul>
            </div>
    )
}export default PasswordRequirements;