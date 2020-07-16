export const powerBIDefinitions = {
  admin: {
    // Innoenergy - all partners together
    reportId: 'd0936626-030f-42a9-a8b2-4df56d28b46e',
    /* eslint-disable max-len */
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=d0936626-030f-42a9-a8b2-4df56d28b46e&autoAuth=true&ctid=18844468-e989-4f91-9160-0616b1374e03&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWItcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCJ9',
    /* eslint-enable max-len */
    filter: false
  },
  adminComparison: {
    // Innoenergy - comparison
    reportId: '03a13817-ada9-42ce-ad55-8b20330307e7',
    /* eslint-disable max-len */
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=03a13817-ada9-42ce-ad55-8b20330307e7&autoAuth=true&ctid=18844468-e989-4f91-9160-0616b1374e03&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWItcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCJ9',
    /* eslint-enable max-len */
    filter: false
  },
  partner: {
    reportId: 'e913a726-9ffe-48e9-b19c-84c8d715caca',
    /* eslint-disable max-len */
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=e913a726-9ffe-48e9-b19c-84c8d715caca&autoAuth=true&ctid=18844468-e989-4f91-9160-0616b1374e03&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWItcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCJ9',
    /* eslint-enable max-len */
    filter: {
      $schema: 'http://powerbi.com/product/schema#basic',
      target: {
          table: 'public v_dm_dim_access',
          column: 'partner_key'
      },
      operator: 'In',
      values: []
    }
  },
  startup: {
    reportId: 'c009de69-36c3-4be2-8f36-c46f485aaf0c',
    /* eslint-disable max-len */
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=c009de69-36c3-4be2-8f36-c46f485aaf0c&autoAuth=true&ctid=18844468-e989-4f91-9160-0616b1374e03&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWItcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCJ9',
    /* eslint-enable max-len */
    filter: {
      $schema: 'http://powerbi.com/product/schema#basic',
      target: {
        table: "public v_dm_dim_access_portfolio_analisis",
        column: "startup_key"
      },
      operator: 'In',
      values: []
    }
  }
}

export const YesAndNo = ['Yes', 'No'];

export const YesNoDunno = ['Yes', 'No', 'Don\'t know yet'];

export const typesOfCompany = [
  'Large Enterprise',
  'Medium-sized',
  'Small',
  'Micro'
];

export const FinancingPlanList = ['Yes', 'No', 'Don`t know yet'];

export const EnergyChallengeAnswerList = ['Yes', 'No', 'Neutral'];
