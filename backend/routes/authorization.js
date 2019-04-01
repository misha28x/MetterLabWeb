const express = require( 'express' );
const mysql = require( 'mysql' );

const router = express.Router();

const connection = require( '../database/db' );

const counters = {
  new_verifications: 0,
  task_planing: 0,
  lab_requests: 0,
  metrology: 0
};

// Авторизація
router.post( "", ( req, res, next ) => {
  connection.query( "SELECT users.id AS user_id, users.user_permissions, users.user_full_name, contractors.id FROM users INNER JOIN contractors ON users.service_provider = contractors.name WHERE 	users.user_name ='" + req.body.email + "' AND users.user_password='" + req.body.pass + "';", ( err, user ) => {
    if ( err ) {
      console.log( err );
      res.json( {
        error: 'Помилка авторизації'
      } );
    }

    if ( user.length > 0 ) {
      console.log( user );
      res.json( {
        userId: user[ 0 ].user_id,
        permission: user[ 0 ].user_permissions,
        username: user[ 0 ].user_full_name,
        serviceProvider: user[ 0 ].id,
      } );
    } else {
      res.json( {
        error: 'Немає такого користувача'
      } );
    }
  } );
} );


module.exports = router;
