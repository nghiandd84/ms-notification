import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigrations1642067520125 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
    CREATE TABLE access (
      id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
      location_id varchar(255) DEFAULT NULL,
      app_id varchar(255) DEFAULT NULL,
      user_id int(11) DEFAULT NULL,
      rule_id varchar(255) DEFAULT NULL
    );`);
    await queryRunner.query(`CREATE TABLE permission (
      id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
      permission_name varchar(255) NOT NULL,
      permission_key varchar(255) NOT NULL,
      description varchar(255) NOT NULL
    );`);

    await queryRunner.query(`CREATE TABLE role (
      id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
      role_key varchar(255) NOT NULL,
      role_name varchar(255) DEFAULT NULL,
      description varchar(255) DEFAULT NULL
    );`);

    await queryRunner.query(`CREATE TABLE role_permissions_permission (
      roleId int(11) NOT NULL,
      permissionId int(11) NOT NULL
    );`);

    await queryRunner.query(`CREATE TABLE users (
      id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
      first_name varchar(255) NOT NULL,
      last_name varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      create_time datetime(6) NOT NULL DEFAULT current_timestamp(6),
      update_time datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
      delete_time datetime(6) DEFAULT NULL,
      password varchar(255) NOT NULL,
      active tinyint(4) NOT NULL DEFAULT 0
      );`);

    await queryRunner.query(`
    ALTER TABLE access
      ADD KEY FK_2d29a8162ec942b00d044d8e170 (user_id),
      ADD KEY FK_0dcf6f12463394723bfacae31a0 (rule_id);`);

    await queryRunner.query(`ALTER TABLE permission
      ADD UNIQUE KEY IDX_b7bf39aea52bf3aac28311ed8f (permission_key);`);

    await queryRunner.query(`ALTER TABLE role
      ADD UNIQUE KEY IDX_105ed5a261406fc25f00319dc6 (role_key);`);

    await queryRunner.query(`ALTER TABLE role_permissions_permission
      ADD KEY (roleId,permissionId),
      ADD KEY IDX_b36cb2e04bc353ca4ede00d87b (roleId),
      ADD KEY IDX_bfbc9e263d4cea6d7a8c9eb3ad (permissionId);`);

    await queryRunner.query(`ALTER TABLE users
      ADD UNIQUE KEY IDX_97672ac88f789774dd47f7c8be (email);`);

    await queryRunner.query(`ALTER TABLE access
      ADD CONSTRAINT FK_0dcf6f12463394723bfacae31a0 FOREIGN KEY (rule_id) REFERENCES role (role_key) ON DELETE NO ACTION ON UPDATE NO ACTION,
      ADD CONSTRAINT FK_2d29a8162ec942b00d044d8e170 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION;`);

    await queryRunner.query(`ALTER TABLE role_permissions_permission
      ADD CONSTRAINT FK_b36cb2e04bc353ca4ede00d87b9 FOREIGN KEY (roleId) REFERENCES role (id) ON DELETE CASCADE ON UPDATE CASCADE,
      ADD CONSTRAINT FK_bfbc9e263d4cea6d7a8c9eb3ad2 FOREIGN KEY (permissionId) REFERENCES permission (id) ON DELETE CASCADE ON UPDATE CASCADE;`);

    // Create default data
    await queryRunner.query(`INSERT INTO users (id, first_name, last_name, email, create_time, update_time, delete_time, password, active) VALUES
    (1, 'NGHIA', 'Nguyen', 'nghiandd.84@gmail.com', '2022-01-10 07:14:14.000609', '2022-01-10 07:14:14.000609', NULL, '$2b$10$2JH17yspa.KHE2ejd3u0IupGIcxON1NSSou0m9h7lKKAqs0nDsWo6', 0);
    `);

    await queryRunner.query(
      `INSERT INTO role (id, role_key, role_name, description) VALUES (NULL, 'SUPER_ADMIN', 'Super Administrator', 'Super Administrator');`,
    );

    await queryRunner.query(
      `INSERT INTO access (id, location_id, app_id, user_id, rule_id) VALUES (NULL, NULL, NULL, '1', 'SUPER_ADMIN');`,
    );

    await queryRunner.query(
      `INSERT INTO permission (id, permission_name, permission_key, description) VALUES (1, 'Assign Role to User', 'USER_ASSIGN_ROLE', 'Assign Role to User');`,
    );
    await queryRunner.query(
      `INSERT INTO permission (id, permission_name, permission_key, description) VALUES (2, 'Un-Assign Role of User', 'USER_UN_ASSIGN_ROLE', 'Un-Assign Role of User');`,
    );
    await queryRunner.query(
      `INSERT INTO permission (id, permission_name, permission_key, description) VALUES (3, 'Assign Permission to Role', 'USER_ASSIGN_PERMISSION', 'Assign Permission to Role');`,
    );
    await queryRunner.query(
      `INSERT INTO permission (id, permission_name, permission_key, description) VALUES (4, 'Un-Assign Permission of Role', 'USER_UN_ASSIGN_PERMISSION', 'Un-Assign Permission of Role');`,
    );
    await queryRunner.query(
      `INSERT INTO role_permissions_permission (roleId, permissionId) VALUES ('1', '1');`,
    );
    await queryRunner.query(
      `INSERT INTO role_permissions_permission (roleId, permissionId) VALUES ('1', '2');`,
    );
    await queryRunner.query(
      `INSERT INTO role_permissions_permission (roleId, permissionId) VALUES ('1', '3');`,
    );
    await queryRunner.query(
      `INSERT INTO role_permissions_permission (roleId, permissionId) VALUES ('1', '4');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // TODO: Implement later
    console.log('Down migrations InitMigrations1641788772000');
    await queryRunner.query(`SELECT * FROM  access`);
  }
}
