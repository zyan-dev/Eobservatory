import React from 'react';

export default class PrivacyPolicy extends React.Component {

  render () {

    return (
      <div className="containerPolicy">

        <h1>Privacy policy</h1>

        <p>{`By uploading content into this E-Observatory Database (“Database”) maintained by InnoEnergy or/and your country partner,` +
          ` and/or filling in forms provided in this Database and/or providing information and documents requested in this Database, ` +
          `you, as the User (as defined here below), hereby indicate your explicit approval to the use of your Data according to the following Privacy Policy:`}</p>

        <ol>
          <li>
            <p>{`InnoEnergy is Processing personal information submitted by you (“User”) in the context of your use of the Database application (“Data”),` +
              ` for the following purpose: measuring the impact of energy start-ups in economy and society. (“Purpose”).`}</p>
          </li>
          <li>
            <p>For the purposes as described under 1, InnoEnergy:</p>
            <ul>
              <li>Compiles statistical information from the Data, on an anonymous basis;</li>
              <li>Collects and stores the Data in Records (i.e one or more records of Data as kept and Processed by InnoEnergy or the Processor as defined under 3.)</li>
              <li>Monitors the User by using the Data in tracking tools;</li>
              <li>Uses the Data to send to the Data Subjects information about InnoEnergy, InnoEnergy services and/or newsletters;</li>
              <li>{`Uses the Data to assess the entrepreneurial ecosystem in the energy field, within the framework of the evolution and forecast of the start-ups and companies,` +
                ` through the group of evaluators from InnoEnergy, and of the country media partners, acting under the instructions of InnoEnergy;`}</li>
              <li>{`Uses the Data for the purposes of research and further validation of the entrepreneurial ecosystem in the energy field, within the framework of the evolution` +
                ` and forecast of the start-ups and companies. All data collected on the E-Observatory platform will be kept completely confidential.` +
                ` Your identity will be kept confidential for the purposes of any research study that includes your data. No information can link your` +
                ` results to you and your identify will not be disclosed in any research publication.`}</li>
              <li>Provides access to the Data as defined in 5.</li>
            </ul>
          </li>
          <li>
            <p>{`The Processing as described in 1 and 2 above can be done by either the InnoEnergy as Controller or by a Processor (i.e. any person or legal entity engaged by InnoEnergy` +
              ` for Processing, and not being an employee nor otherwise subjected to the authority of InnoEnergy or InnoEnergy’s Executive Board or any of its members) engaged to that end,` +
              ` such as the different country media partners. “Process” or “Processing” shall mean each (set of) action(s) as regards to the Data, including, but not limited to, the collecting,` +
              ` recording, sorting, keeping, updating, amending, retrieving, consulting, using, provisioning by way of forwarding or other way of dissemination, gathering, linking,` +
              ` protecting, erasing or destroying of Data.`}</p>
          </li>
          <li>
            <p>{`At your request as User, you may exercise your rights of access, rectification and deletion, limitation of processing, portability of data and opposition in relation` +
              ` to your personal data. The request shall be addressed to: InnoEnergy / Hightech Campus 69 / 5656 AG Eindhoven / The Netherlands or by email: `}
              <a href="mailto:gabriela.solana@innoenergy.com">gabriela.solana@innoenergy.com</a>
              {`. Data will be removed from the Records, unless the preservation is required by law or for the purpose of the Records themselves. Any refusal to remove or delete (parts of)` +
              ` Data will be substantiated in terms of necessity to preserve the Data, notwithstanding your request for removal or deletion.`}</p>
          </li>
          <li>
            <p>{`As User, and through the use of this Database, you hereby grant your explicit and unambiguous consent that a) InnoEnergy and Processors Process the Data as described above and b)` +
              ` InnoEnergy submits the Data to the Partners (i.e. any of InnoEnergy’s partners as defined in Annex II of the EIT InnoEnergy InnoEnergy Framework Partnership Agreement)` +
              ` for the Purpose described above.`}</p>
          </li>
          <li>
            <p>{`As User, you may, while observing reasonable intervals, each time request from InnoEnergy to be informed as regards to whether any Data relating to you is being Processed,` +
              ` which request should be addressed to the addressee as described in 4 above. InnoEnergy shall inform you, within four (4) weeks after the receipt of such a request, of whether any` +
              ` Data relating to you is being Processed, and, if so and where applicable, provide a specification of that Data, a description of the objectives or purposes of its Processing,` +
              ` the possible categories of Processed Data, the persons who are meant to receive the Data and a description of the origins of the Data. You may request InnoEnergy to correct,` +
              ` supplement, remove, or protect (parts of) the specified Data if that Data is incorrect, incomplete or irrelevant for the objectives and purposes for which it was being Processed,` +
              ` or if the Processing would otherwise be unlawful. InnoEnergy will inform you in writing within four (4) weeks after the receipt of a request as described above of whether the` +
              ` request will be met. If InnoEnergy decides not to meet the request made, the refusal shall be explained. If InnoEnergy decides to meet the request made the necessary` +
              ` measures will be taken as soon as reasonably possible.`}</p>
          </li>
          <li>
            <p>{`InnoEnergy may use “cookies” (small pieces of data stored on the User’s computer) or similar tools using anonymized information to enable the User to sign in to certain services` +
               ` to protect both you and InnoEnergy, help make InnoEnergy services easier to use or tailor your experience, or for analytics to help InnoEnergy understand how users engage with` +
               ` the InnoEnergy services and to improve their features. The Cookies policy is part of this Privacy Policy.`}</p>
          </li>
          <li>
            <p>{`This Privacy Policy has been adopted taking into account the prescriptions of the Dutch Data Protection Act and EU General Data Protection Regulation (GDPR). Situations not` +
              ` foreseen in this Privacy Policy will be decided on by InnoEnergy on a case by case basis, taking into account the objectives of this Privacy Policy, the reasonable interests of` +
              ` all parties involved and applicable laws and regulations.`}</p>
          </li>
          <li>
            <p>{`This Privacy Policy may be amended by InnoEnergy from time to time. Amendments to this Privacy Policy will enter into force after publication` +
               ` of the revised version on E-Observatory.`}</p>
          </li>
          <li>
            <p>{`By clicking this agreement you expressly agree and authorize InnoEnergy and its Processors (country media partners) to treat the information and data that you are` +
              ` voluntarily providing according to the proposed treatment.`}</p>
          </li>
        </ol>
      </div>
    );

  }

}
