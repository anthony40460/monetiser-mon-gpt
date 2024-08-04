import React from 'react';
import Layout from '../components/common/Layout';
import Typography from '../components/common/Typography';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
  return (
    <Layout>
      <Typography variant="heading" size="xxlarge">
        Bienvenue sur Monetiser-mon-gpts
      </Typography>
      <Typography size="large" as="p">
        Transformez vos GPTs en sources de revenus passifs
      </Typography>
      <Card title="Commencez d�s maintenant">
        <Typography as="p">
          Cr�ez, int�grez et mon�tisez vos GPTs personnalis�s en quelques clics.
        </Typography>
        <Button>D�marrer</Button>
      </Card>
    </Layout>
  );
};

export default Home;